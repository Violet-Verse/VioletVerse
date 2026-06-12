var Airtable = require("airtable");

let postTable;
try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID_POSTS;
    const tableName = process.env.AIRTABLE_TABLE_NAME_POSTS;

    if (!apiKey || !baseId || !tableName) {
        console.error(
            "WARNING: Airtable POSTS env vars missing. Airtable queries will fail."
        );
        postTable = null;
    } else {
        var base = new Airtable({ apiKey }).base(baseId);
        postTable = base(tableName);
    }
} catch (err) {
    console.error("Failed to initialize Airtable (posts):", err);
    postTable = null;
}

const minifyRecords = (records) => {
    return records.map((record) => getMinifiedRecord(record));
};

const getMinifiedRecord = (record) => {
    return record.fields;
};

export { postTable, getMinifiedRecord, minifyRecords };
