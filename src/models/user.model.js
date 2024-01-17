import mongoose, { Schema }  from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        lowercase: true,
        trim : true,
        unique: true,
        index :true 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    fullName :{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar :{
        type: String, // cloudnary service.. 
        required: true,
    },
    coverImage: {
        type :String,
    },
    watchHistory :[
        {
            type : Schema.Types.ObjectId,
            ref : "Video", /// video hai model name with with it has been exported.
        }
    ],

    password: {
        type : String,
        required: true,
    },
    refreshToken: {
        type : String
    }

}, {
    timestamps : true
})

// sice mongodb offers us middlewares and give us freedom to write our code in best way so by production grade level
// we will use middlewares over here to do the work ,, like pre hooks.. 
/*  since in db password are not saved plane so we use bcypt to convert them in has and than saves it in db*/

/** saving bcypt password in db 
 * but making sure if password modification is requireed only than running it
 * bcz if not applied carefully than this method can run every time save will be called\
 */
 userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password =  await bcrypt.hash(this.password, 10);
    next();
 })

 /** now also want to provide way to decrypt it bcz jb login hoga to methods dene pdega to 
  * ek methods.property add krta hai isCorrectPassword.
  * aur b crypt ka compare jo hai voh boolen reaturn krta hai. 
  * these methods will be accessesd by an object crated by this schme not by User since that is mongoose objct
  */
 userSchema.methods.isCorrectPassword =  async function(password){
    /**this represent object of schema with whome this function will be linked to call */
     return await bcrypt.compare(password, this.password);
 } 

 /** now we have to use jwt as well for the refresh token and accesstoken and both of these will use   jwt 
  * * and jwt doesnt take much time like bcrypt therefore there is no need of using async await here
 */

 userSchema.methods.generateAccessToken = function (){
   return  jwt.sign({
        _id: this._id,
        username: this.username,
        fullName : this.fullName,
    }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
    });
 }

/** this refress token generation will also be same as avove one only difference will be that it will hold very few
 * data compare to the payload of the accesstoken 
 */
 userSchema.methods.generateRefreshToken = function (){
   return  jwt.sign({
        _id: this._id,
    }, process.env.JWT_REFRESH_TOKEN_SECRET , {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
    });
 }

 export  const User = mongoose.model("User", userSchema);