import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

export async function connectToCosmosDB() {
  try {
    const client = new MongoClient(process.env.COSMOSDB_CONNECTIONSTRING, {});
    await client.connect().then(() => {
      console.log("Connected to Azure Cosmos DB for MongoDB");
    });
    // const database = client.db("booksDatabase");
    // const collection = database.collection("booksCollection");
    // Close the connection when done
    // await client.close();
    // console.log("Connection closed.");
  } catch (error) {
    console.error("Error connecting to Azure Cosmos DB:", error);
  }
}
