import express from "express";
import helloController from "./controllers/hello.controller";
import auctionController from "./controllers/auction.controller";

const app = express();
app.use(express.json());

app.use("/api", helloController);
app.use("/api/auction", auctionController);

export default app;
