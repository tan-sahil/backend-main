import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

//using cors by setting its origin or white listing selcted url;

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}))
// for data provide as json body

app.use(express.json({limit: "16kb"})) ; // here limit is useed so that unlimitd data is not fed to server

// data can also be from url and encoding it is also important!!!!!!

app.use(express.urlencoded({extended: true, limit: "16kb"}));

// public file me file save krna

app.use(express.static("public"));

app.use(cookieParser());


/**routes import */
import userRouter from "./routes/user.route.js";

/**routes declaration */
app.use("/api/v1/users", userRouter);

export {app};