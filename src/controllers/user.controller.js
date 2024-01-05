import e from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";
import { ResponseApi } from "../utils/ResponseApi.js";
const registerUser = asyncHandler(async (req, res) => {
    // data receive and then empty check 
    // username and email unique hai? 
    // avatar pr check lgana hai 
    // avatar ko cloudinary pr save krna hai
    // db me data ko store krva na hai 
    // reponse bhejna hai
    const {fullName, email, password, username} = req.body;
    if(fullName === "") throw new ApiError(400, "fullname is required") // oreder bad me dhyan denge
    if([ email, password, username].some((feild) => 
        feild?.trim() === "")){
            throw new ApiError(400, "All feilds are required to be filled")
        }
    
   const userExsist = await User.findOne({
        $or : [{username}, {email}]
    });

    if(userExsist) {
        throw new ApiError(400, "username and email already exsist");
    }
    
    const avatarLocalpath =  req.files?.avatar[0]?.path;    // multer ne access diya hai
    const coverImageLocalpath =  req.files?.coverImage[0]?.path; 
    if(!avatarLocalpath){
        throw new ApiError(400, "avatar is required");
    }
    const avatar = await cloudinaryUploader(avatarLocalpath); 
    const coverImage = await cloudinaryUploader(coverImageLocalpath);

   const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowercase(),
        avatar : avatar.url,
        coverImage: coverImage?.url || ""
    })
   const reponse = await User.findById(user._id).select("-password -refreshToken");
   if(!reponse){
    throw new ApiError(409, "something went wrong while saving to the db");
   }
   return res.status(201).json(
   new ResponseApi(200, reponse, "user is registered succesfullt ")
   )
})


export   {registerUser}