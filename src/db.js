import { MongoClient } from 'mongodb';

const url = process.env.DB_URL;
const dbName = `todolist`;
const client = new MongoClient(url);

export let db;
export let counter;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`DB is connected to Mongo Server`);
    counter = await db.collection('counter').findOne({ name: 'counter' });
    if (counter === null) {
      counter = await db
        .collection('counter')
        .insertOne({ name: 'counter', count: 0 });
    }
  } catch (error) {
    console.log(error);
  }
};
