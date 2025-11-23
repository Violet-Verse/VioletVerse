// MongoDB is disabled - no connection URI required
// Export a mock database object to prevent errors when imported

// Mock collection object with common MongoDB methods
const createMockCollection = () => ({
  find: () => ({
    toArray: () => Promise.resolve([]),
    sort: function () {
      return this
    },
    limit: function () {
      return this
    },
    skip: function () {
      return this
    },
  }),
  findOne: () => Promise.resolve(null),
  insertOne: () => Promise.resolve({ insertedId: null }),
  insertMany: () => Promise.resolve({ insertedIds: [] }),
  updateOne: () => Promise.resolve({ modifiedCount: 0 }),
  updateMany: () => Promise.resolve({ modifiedCount: 0 }),
  deleteOne: () => Promise.resolve({ deletedCount: 0 }),
  deleteMany: () => Promise.resolve({ deletedCount: 0 }),
  countDocuments: () => Promise.resolve(0),
})

// Mock database object
const createMockDatabase = () => ({
  collection: (name) => createMockCollection(),
  admin: () => ({}),
  listCollections: () => ({ toArray: () => Promise.resolve([]) }),
})

let client = null
let mockDb = null

export default async function connectDatabase() {
  // If MongoDB URI is not provided, return mock database
  if (!process.env.MONGODB_URI) {
    if (!mockDb) {
      mockDb = createMockDatabase()
      console.warn(
        'MongoDB URI not found, using mock database. Database operations will return empty results.',
      )
    }
    return mockDb
  }

  // If client doesn't exist or is not connected, create/connect it
  if (!client) {
    try {
      const { MongoClient } = await import('mongodb')
      client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      await client.connect()
    } catch (error) {
      console.warn('MongoDB connection failed, using mock database:', error.message)
      if (!mockDb) {
        mockDb = createMockDatabase()
      }
      return mockDb
    }
  }

  // Return the database - connection is already established
  // If connection fails later, it will be handled by individual operations

  return client.db('vv_blog')
}
