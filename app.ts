import express from "express";
import cors from "cors";
import routes from "./src/routes";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use('/api', routes);

export default app;
