// Airtable is disabled - no API key required
// Export a mock table object to prevent errors when imported
const mockTable = {
    select: () => ({
        all: () => Promise.resolve([]),
        firstPage: () => Promise.resolve([]),
    }),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    destroy: () => Promise.resolve({}),
};

const table = process.env.AIRTABLE_API_KEY 
    ? (() => {
        try {
            var Airtable = require("airtable");
            var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
                process.env.AIRTABLE_BASE_ID
            );
            return base(process.env.AIRTABLE_TABLE_NAME);
        } catch (error) {
            console.warn("Airtable initialization failed, using mock:", error.message);
            return mockTable;
        }
    })()
    : mockTable;

export { table };
