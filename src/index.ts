import * as express from "express";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;



app.use((req, res, next) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});