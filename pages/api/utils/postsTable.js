let postTable = null;

if (
    process.env.AIRTABLE_API_KEY &&
    process.env.AIRTABLE_BASE_ID_POSTS &&
    process.env.AIRTABLE_TABLE_NAME_POSTS
) {
    var Airtable = require("airtable");
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
        process.env.AIRTABLE_BASE_ID_POSTS
    );
    postTable = base(process.env.AIRTABLE_TABLE_NAME_POSTS);
}

const minifyRecords = (records) => {
    if (!records) return [];
    return records.map((record) => getMinifiedRecord(record));
};

const getMinifiedRecord = (record) => {
    return record.fields;
};

export { postTable, getMinifiedRecord, minifyRecords };