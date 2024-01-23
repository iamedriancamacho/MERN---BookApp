import express from "express";
import { MongoClient } from "mongodb";
import { Book } from "../models/bookModel.js";
import { uuid } from "uuidv4";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

export const router = express.Router();

const cosmosDbConnectionString = process.env.COSMOSDB_CONNECTIONSTRING;
const databaseName = process.env.DATABASENAME;
const collectionName = process.env.COLLECTIONNAME;

//MongoDB connection
const client = new MongoClient(cosmosDbConnectionString, {});

//GET ALL
router.get("/", async (req, res) => {
  try {
    await client.connect().then(() => {
      console.log("MongoDB.GET is here");
    });
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const books = await collection.find({}).toArray();
    //console.log("All Documents", books);
    return res.status(200).send(books);
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry, cant find that");
  } finally {
    // Close the connection when done
    await client.close();
  }
});

//GET ONE BOOK by Id
router.get("/:id", async (req, res) => {
  try {
    await client.connect().then(() => {
      console.log("MongoDB.GET is here");
    });

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    //deconstructing the request params.
    const { id } = req.params;
    const book = await collection.findOne({ _id: id }); // Corrected: pass ID within an object

    if (book) {
      return res.status(200).send(book);
    } else {
      return res.status(404).send("Book not found");
    }
  } catch (err) {
    console.error(err);
    res.status(404).send("Sorry, cant find that");
  } finally {
    // Close the connection when done
    await client.close();
  }
});

// UPDATE ONE BOOK by Id
router.put("/:id", async (req, res) => {
  try {
    await client.connect().then(() => {
      console.log("MongoDB.PUT is here");
    });

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // deconstructing the request params.
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated book data in the request body

    // Check if the book with the specified ID exists
    const existingBook = await collection.findOne({ _id: id });
    if (!existingBook) {
      return res.status(404).send("Book not found");
    }
    console.log("existing Book \b", existingBook);

    // Validate the update data against the Book schema
    //const isValidUpdate = validateUpdateData(updateData); // Implement your validation logic

    // if (!isValidUpdate) {
    //   return res.status(400).send("Invalid update data");
    // }

    // Update the book and timestamp
    updateData.timestamp = new Date();
    const result = await collection.updateOne(
      { _id: id },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      // If at least one document was modified, consider it a success
      const updatedBook = await collection.findOne({ _id: id });
      return res.status(200).send(updatedBook);
    } else {
      // If no documents were modified, the book might not exist or the updateData is the same
      return res.status(400).send("No changes made or book not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection when done
    await client.close();
  }
});

//Insert a new Book to the Database
router.post("/", async (req, res) => {
  const client = new MongoClient(cosmosDbConnectionString, {});
  const newBooksId = uuid();
  try {
    await client.connect();
    console.log("MongoDB.POST is here");
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    const newBook = new Book(
      {
        _id: newBooksId,
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear,
      },
      {
        timestamp: true,
      }
    );
    console.log(newBook.toJSON());
    // Insert the document
    await collection.insertOne(newBook, { timeout: 30000 }).then((answer) => {
      res.status(201).send(answer);
    }); // 30 seconds timeout
    //res.status(201).send(result);
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the connection when done
    await client.close();
  }
});

// DELETE ONE BOOK by Id
router.delete("/:id", async (req, res) => {
  try {
    await client.connect().then(() => {
      console.log("MongoDB.DELETE is here");
    });

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // deconstructing the request params.
    const { id } = req.params;

    // Check if the book with the specified ID exists
    const existingBook = await collection.findOne({ _id: id });
    if (!existingBook) {
      return res.status(404).send("Book not found");
    }

    // Delete the book
    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      // If at least one document was deleted, consider it a success
      return res.status(200).send("Book deleted successfully");
    } else {
      // If no documents were deleted, the book might not exist
      return res.status(400).send("Book not found or unable to delete");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection when done
    await client.close();
  }
});

// Function to validate update data against Book schema
// function validateUpdateData(updateData) {
//   const bookKeys = Object.keys(Book.schema.paths);
//   const updateDataKeys = Object.keys(updateData);

//   console.log('bookKeys \b',bookKeys);
//   console.log('updateDataKey \b', updateDataKeys);

//   // Check if the keys in updateData match the keys in the Book schema
//   const isValidStructure = bookKeys.every((key) =>
//     updateDataKeys.includes(key)
//   );
//   return isValidStructure;
// }
