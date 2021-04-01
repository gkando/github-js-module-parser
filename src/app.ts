import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
// import service from "./service/service.js";

// Create Express server
const app = express();

// Express configuration

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} to ${req.path}`);
  next();
}

app.use(loggerMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());

// app.use("/service", service);

app.get("/", (req, res) => res.send("Express + TypeScript app"));

export default app;
