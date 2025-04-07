// Use module augmentation instead of namespace
declare module "express" {
  interface Request {
    user?: { userId: string };
  }
}

import "dotenv/config";
import express from "express";
import next from "next";
import bodyParser from "body-parser";

import { connectDB } from "./config/db";
import { bookRouter, authRouter, collectionRouter } from "./routes";

connectDB();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbopack: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use("/api/books", bookRouter);
  server.use("/api/collections", collectionRouter);
  server.use("/api/", authRouter);

  // Handle all other requests with Next.js
  server.all("*", (req, res) => handle(req, res));

  server.listen(process.env.PORT, (err) => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${process.env.PORT}`);
  });
});
