const express = require('express');
const app = express();
const port = process.env.PORT || 5500
const mongoose = require('mongoose');  // used to handle mongo db
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const corsOptions ={
   origin:'http://localhost:3000', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200
}
const {notFound, errorHandler}= require('./middlewares/errorMiddleware')
const router = require("express").Router(); //imports express

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

app.use(cors(corsOptions));

//routes separeted accordingly 
app.use("/api/users", userRoute); 
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

//Error handler
app.use(notFound);
app.use(errorHandler);


app.listen(port,()=>{
    console.log("backend server running on port!" ,port);
});

