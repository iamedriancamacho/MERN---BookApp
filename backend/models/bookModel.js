import mongoose from "mongoose";
import { collectionName } from "../config.js";

const bookSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    required: true,
    type: String,
  },
  author: {
    required: true,
    type: String,
  },
  genre: {
    required: true,
    type: String,
    immutable: false
  },
  publicationYear: {
    required: true,
    type: Number,
  },
  timestamp: {
    required: true,
    type: Date,
    default: () => new Date(), // Use a function to set the default value to the current UTC timestamp
  },
});
export const Book = mongoose.model(collectionName, bookSchema);
