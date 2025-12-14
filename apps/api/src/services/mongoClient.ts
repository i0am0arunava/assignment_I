import { MongoClient, Db } from "mongodb";

const uri = "mongodb+srv://pariarunava:wlHTktWJBPeqNBV5@cluster0.5ixyts2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");
  }
  if (!db) {
    db = client.db("pollingDB"); // choose your database name
  }
  return db;
}

export async function disconnectDB() {
  if (client) {
    await client.close();
  
    console.log("❌ Disconnected from MongoDB");
  }
}
