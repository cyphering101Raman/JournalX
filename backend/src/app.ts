import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api", routes);


app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "JournalX Backend is healthy!" });
});

app.use(errorHandler);

export default app;
