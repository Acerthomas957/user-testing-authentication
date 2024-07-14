process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
})

const express = require ("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({path: './.env'});
const mongoose = require("mongoose");
const globalErrorHandler = require("./middlewares/errorController");
const userRouter = require('./routes/user.route');

let app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.use('/api/users',userRouter);

mongoose.connect(process.env.DB_URL).then(conn => {
    console.log(`Db is connected with ${conn.connection.host}`);
})

const port =process.env.PORT || 8000;

const server = app.listen(port ,() => {
    console.log(`Server is running at port ${port}.`);
})

app.use(globalErrorHandler);

process.on('unhandledRejection', (err) =>{
    console.log(err.name, err.message);
    console.log("Unhandled rejection occured! Shutting down...");

    server.close(()=>{
        process.exit(1);
    })
});