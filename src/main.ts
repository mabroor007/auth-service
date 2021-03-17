import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm"
import UserRouter from "./users/user.controller"

const app = express();

// Env
const PORT = process.env.PORT || 4000;
const DBHOST = process.env.DBHOST || "localhost";
const DBPASSWORD = process.env.DBPASSWORD || "pwd";
const DBUSER = process.env.DBUSER || "postgres";
const DB = process.env.DB || "authdb";
const DBPORT = process.env.DBPORT || 5432;

// Middleware to parse json data
app.use(express.json());

// Injecting user router in application
app.use("/user", UserRouter);

// Retry logic for database
let connectionAtempts = 0;
function startServer() {
  createConnection({
    type: "postgres",
    host: DBHOST,
    port: Number(DBPORT),
    username: DBUSER,
    password: DBPASSWORD,
    database: DB,
    entities: [],
    synchronize: true,
    logging: false,
  })
    .then(() => {
      // Server starting
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch(() => {
      if (connectionAtempts > 5) return;
      connectionAtempts++;
      console.log("Trying to connect again...");
      setTimeout(startServer, 2000);
    });
}

// Creating connection and then starting server
startServer();

