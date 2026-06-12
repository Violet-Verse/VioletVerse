var Airtable = require("airtable");

let table;
try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName) {
        console.error(
            "WARNING: Airtable env vars missing (AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME). Airtable queries will fail."
        );
        table = null;
    } else {
        var base = new Airtable({ apiKey }).base(baseId);
        table = base(tableName);
    }
} catch (err) {
    console.error("Failed to initialize Airtable:", err);
    table = null;
}

export { table };
