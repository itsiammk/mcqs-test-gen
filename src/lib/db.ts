import mongoose from 'mongoose';

const MONGODB_URI="mongodb+srv://mahesh:maheshkblog@cluster0.baoom2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, we reset the promise to allow for a retry on the next request.
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
