import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create();
    }

    const dbUrl = process.env.NODE_ENV === 'test' ? mongod.getUri() : process.env.MONGO_URI;

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    console.log('Disconnecting database...');
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export { connectDB, disconnectDB };

