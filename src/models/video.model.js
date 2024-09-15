
import mongoose, {Schema}from "mongoose";
import mongoose, {model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const videoSchema = new Schema(
     {
          videoFile:{
               type: String, // Cloudinary url
               required: true
          },
          thumbNail: {
               typr: String,  // cloudinary url
               required: true,
               unique: true
          },
          owner:{
               type:Schema.Types.ObjectId,
               ref: "User",
          },
          title: {
               type: String,
               required: true,
          },
          description: {
               type: String,
               required: true
          },
          duration: {
               type: Number,
               required: true
          },
          views: {
               type: Number,
               default:0,
               required: true
          },
          isPublished: {
               type: Boolean,
               default: true
          }


     },{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate);


export const Video = model("Video",videoSchema); 