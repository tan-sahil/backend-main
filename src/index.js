import  dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path : './env'       // ./env root directory me ja kr env ko pkdo

})


connectDB();