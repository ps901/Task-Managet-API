const express= require("express");
const app = express();
require("./db/mongoose"); // make sure file runs
const userRouter = require("./router/user");
const taskRouter = require("./router/task");

const port = process.env.PORT || 3000;




app.use(express.json()); //parse incoming json to object
app.use(userRouter);
app.use(taskRouter);

// without middleware : new request => run route handler

// with middleware: new request => do something => run route handler


app.listen(port, () => {
    console.log("server started")
})


