import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";
export const verifyJwt = async (req, res, next) =>{
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if(!tokenoken) {
            throw new ApiError(401, "unauthorized request")
        }
        const decodeToken = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
       
        const user = await User.findById(decodeToken?._id).select("-password refreshToken");
        if(!user) {
            throw new ApiError(401, "unauthorized request")
        }  
        req.user = user;
        next();

        
    } catch (error) {
        console.log(error);
        throw new ApiError(401, error.message? error.message: "issue while doing the token verification")
    }
}