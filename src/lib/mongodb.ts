import mongoose, { ConnectOptions } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local")
}

// Type declaration for global mongoose cache
declare global {
  var mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined
}

let cached = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!cached?.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    const connection = await cached!.promise
    cached!.conn = connection
  } catch (e) {
    cached!.promise = null
    console.error("❌ MongoDB connection error:", e)
    throw e
  }

  return cached!.conn
}
