import mongoose, {Schema} from "mongoose";


const subscriptionSchema = new Schema(
     {
    subscriber:{
     type: Schema.Types.ObjectId,      // The subscriber 
     ref:"User"
    },
    channel:{
     type:Schema.Types.ObjectId,     // The channel which was subscribed by the User
     ref:"User"
    }
    
},{timestamps:true});



export const Subscription = mongoose.model("Subsctription", subscriptionSchema)