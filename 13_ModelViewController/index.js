const express = require("express");
const userRouter = require("./routes/user");
const connectMongoDb = require("./connection")
const logReqRes = require('./middlewares') //BY DEFAULT IT DETECT THE index.js FILE

const app = express();
const PORT = 8000;

//Connection
connectMongoDb().then(() => console.log("MongoDb Connected"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logReqRes('log.txt'))
app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`Server started on PORT- ${PORT}`));
