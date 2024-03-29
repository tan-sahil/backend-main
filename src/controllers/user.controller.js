import e from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";
import { ResponseApi } from "../utils/ResponseApi.js";
import jwt from 'jsonwebtoken'
const generateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    /**since im saving only one feils and since password is not setting so we will skip validation for this save */
    user.save({validateBeforeSave: false})
    return {accessToken, refreshToken};
}
const registerUser = asyncHandler(async (req, res) => {
    console.log("request is here in register", req.body)
    // data receive and then empty check 
    // username and email unique hai? 
    // avatar pr check lgana hai 
    // avatar ko cloudinary pr save krna hai
    // db me data ko store krva na hai 
    // reponse bhejna hai
    const {fullName, email, password, username} = req.body;
    
    if(fullName === ""){
       
        throw new ApiError(400, "fullname is required") // oreder bad me dhyan denge
    }
    if([ email, password, username].some((feild) => 
        feild?.trim() === "")){
            throw new ApiError(400, "All feilds are required to be filled")
        }
    
        /** $or generally both checks lgata hai */
   const userExsist = await User.findOne({
        $or : [{username}, {email}]    // generally values are passed in key-value pair
    });

    if(userExsist) {
        throw new ApiError(400, "username and email already exsist");
    }
    if (req.files) console.log(req.files);
    
    const avatarLocalpath =  req.files?.avatar[0]?.path; 
    
       // multer ne access diya hai
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
        username: username.toLowerCase(),
        avatar : avatar.url,
        coverImage: coverImage?.url || ""
    })
   const response = await User.findById(user._id).select("-password -refreshToken");
   if(!response){
    throw new ApiError(409, "something went wrong while saving to the db");
   }
   return res.status(201).json(
   new ResponseApi(200, response, "user is registered succesfullt ")
   )
})

/**login ka register */
const loginUser = asyncHandler(async (req, res) => {
    /**details destructure */
    const {username, email, password}=req.body;
    if(!username && !email){
        new ApiError(405, "please provide username or email");
    }
    const user = await  User.findOne({
        $or : [{username}, {email}]
    })
    if(!user){
        new ApiError(404, "username and email is not valid")
    }
    /**user is in db so check validate with password */
      const isValidPassword = await user.isCorrectPassword(password);
      if(!isValidPassword){
        new ApiError(404, "incorrect username or password")
      }
      /**refresh token set krna hai and access token bhi for that i will creat a function */
       const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
       const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
       const options = {
        httpOnly : true,
        secure : true
       }
       res.status(200)
       .cookie("accessToken", accessToken, options )
       .cookie("refreshToken", refreshToken, options)
       .json(new ResponseApi(201,  {
        user : loggedInUser , accessToken, refreshToken
       }, "user Logged in Succesfully"
       ))
})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
        $set: {
            refreshToken: undefined
        }
            
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200)
 .clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ResponseApi(200,{}, "user Logged out Succesfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(404, "no refresh token provided")
    }
    const verifiedToken = await jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    if(!verifiedToken){
        throw new ApiError(401, "not valid refreshToken")
    }
    const user = await User.findById(verifiedToken._id);
    if(!user){
        throw new ApiError(401, "incorrect refresh token");
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "refresh token is not valid")
    }
    const {newRefreshToken, accessToken} = await generateAccessTokenAndRefreshToken(user._id);
   


    // newly generated refresh and access token ko db me bhi bhejna hai
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("accessToken", accessToken , options)
    .json(
        new ResponseApi(200,
            {
                accessToken, refreshToken : newRefreshToken
            }, "AcessToken refreshed")
    )
})

const updatePassword = asyncHandler(async (req, res) => {
    // middlware validate kr chuka hai aur req.user ko populate kr chucka hai;
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const validatePassword = user.isCorrectPassword(oldPassword);
    if(!validatePassword){
        throw new ApiError(400, "old password is not correct")
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new ResponseApi(200, {}, "password updated successfully"))
})

const getLoggedInUser = asyncHandler(async (req, res) => {
    // middleware has injected req.user so now just have to get it from there;
    const user = req.user;
    if(!user){
        throw new ApiError(404, "user not found")
    }
    return res.status(200).json(new ResponseApi(200, user, "user found"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullName, email} = req.body;
    if(!fullName || !email){
        throw new ApiError(400, "fullName and email feilds are required")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullName, email    
        }
    }, {
        new: true // send me the updated user 
    }).select("-password");
    if(!user){
        throw new ApiError(404, "user not found")
    }
    return res.status(200).json(new ResponseApi(200, user, "user details updated"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalpath = req.file?.path;  // since only single file is being is sent so this is 
    // needed to be mananged properly and through multer this is needed to be taken care of this is 
    //not the case like the register controller where we have multiple files to be uploaded
    if(!avatarLocalpath){
        throw new ApiError(400, "avatar is missing")
    }
    const avatar = await cloudinaryUploader(avatarLocalpath);
    if(!avatar.url){
        throw new ApiError(400, "something went wrong while uploading to cloudinary")
    }

    FileSystem.unlinkSync(avatarLocalpath);
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar?.url
        }
    }, {
        new: true
    }).select("-password");

    return res.status(200).json(new ResponseApi(200, user, "user avatar updated"));
})
export   {registerUser, loginUser, 
    logoutUser, refreshAccessToken, updatePassword, getLoggedInUser, updateAccountDetails,
    updateUserAvatar}