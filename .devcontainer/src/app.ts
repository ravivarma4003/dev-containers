import express from "express";
import helloController from "./controllers/hello.controller";

const app = express();
app.use(express.json());

app.use("/api", helloController);

export default app;


