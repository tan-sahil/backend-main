import  dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : './env'       // ./env root directory me ja kr env ko pkdo

})


connectDB()  // since itis a promise.
.then(()=> {
    app.listen(process.env.PORT|| 8000 , ()=> console.log(`app is listenig at port number ${process.env.PORT}`))
    app.on('error', (error) => {
        console.error("app is not loading : " , error);
        throw error;
    })
}).catch((err) =>  console.log("error while reciving db", err));

