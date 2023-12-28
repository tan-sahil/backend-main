import mongoose ,{Mongoose, Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile : {
        type: String,
        required: true,

    },
    thumbnail :{
        type:String,
        required: true
    },
    title : {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    duration : {
        type : Number, // cloudanry 
        required: true
    }, 
    views: {
        type: Number,
        default : 0
    },
    isPublished :{
        type : Boolean,
        default : true
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    }
}, {
    timestamps: true
})

// will add someplugins for aggeraations over here.. 

export const Video = mongoose.model("Video",videoSchema );