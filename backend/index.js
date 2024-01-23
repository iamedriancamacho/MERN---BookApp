import express from "express";
import { connectToCosmosDB } from "./db.js";
import { router } from "./routes/booksRoute.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const app = express();
//Middleware to parse request.body
app.use(express.json());

//Middleware for CORS Policy
//allows all origins with default of cors
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

//Database connection
connectToCosmosDB().finally(
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  })
);

app.use("/books", router);
