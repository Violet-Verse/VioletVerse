var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID_POSTS
);

const table = base(process.env.AIRTABLE_TABLE_NAME_POSTS);

const minifyRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record));
};

const getMinifiedRecord = (record) => {
    return record.fields;
};

export { table, getMinifiedRecord, minifyRecords };
