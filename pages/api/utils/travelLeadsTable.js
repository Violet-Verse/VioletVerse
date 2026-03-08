let travelLeadsTable = null;

if (
    process.env.AIRTABLE_API_KEY &&
    process.env.AIRTABLE_TRAVEL_BASE_ID &&
    process.env.AIRTABLE_TRAVEL_TABLE_NAME
) {
    var Airtable = require("airtable");
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        process.env.AIRTABLE_TRAVEL_BASE_ID
    );
    travelLeadsTable = base(process.env.AIRTABLE_TRAVEL_TABLE_NAME);
}

const minifyRecords = (records) => {
    if (!records) return [];
    return records.map((record) => getMinifiedRecord(record));
};

const getMinifiedRecord = (record) => {
    return { id: record.id, ...record.fields };
};

export { travelLeadsTable, getMinifiedRecord, minifyRecords };
