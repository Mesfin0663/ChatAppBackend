const express = require('express');
const app = express();

const mongoose = require('mongoose');  // used to handle mongo db
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const {notFound, errorHandler}= require('./middlewares/errorMiddleware')

// importing rout modules created and maintained separately 
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

//required to process .env files such as mongodb url and other secrets
dotenv.config();


//Initializing mongodb connection

mongoose.connect(
   process.env.MONGO_URL, {useNewUrlParser: true},
   ()=>{
      console.log("connected to mongodb");
   }
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//routes separeted accordingly 
app.use("/api/users", userRoute); 
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

//Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(8800,()=>{
    console.log("backend server running!");
});