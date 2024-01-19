import express from "express";
import { connectToCosmosDB } from "./db.js";
import { PORT } from "./config.js";
import { router } from "./routes/booksRoute.js";
import cors from "cors";

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
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
);

app.use("/books", router);
