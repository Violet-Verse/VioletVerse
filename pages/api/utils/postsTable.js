// Airtable is disabled - no API key required
// Export mock objects to prevent errors when imported

const minifyRecords = (records) => {
  if (!records || !Array.isArray(records)) return []
  return records.map((record) => getMinifiedRecord(record))
}

const getMinifiedRecord = (record) => {
  return record?.fields || {}
}

// Mock postTable object
const mockPostTable = {
  select: () => ({
    all: () => Promise.resolve([]),
    firstPage: () => Promise.resolve([]),
  }),
  create: () => Promise.resolve({}),
  update: () => Promise.resolve({}),
  destroy: () => Promise.resolve({}),
}

const postTable = process.env.AIRTABLE_API_KEY
  ? (() => {
      try {
        var Airtable = require('airtable')
        var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
          process.env.AIRTABLE_BASE_ID_POSTS,
        )
        return base(process.env.AIRTABLE_TABLE_NAME_POSTS)
      } catch (error) {
        console.warn('Airtable initialization failed, using mock:', error.message)
        return mockPostTable
      }
    })()
  : mockPostTable

export { postTable, getMinifiedRecord, minifyRecords }
