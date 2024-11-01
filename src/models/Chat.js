import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    context:{
        type:String
    },
    model: { type:String, default:"llama3.2"},
    prompt: {type : String},
    resposne:{
        type:String
    },
    created_at:{type:String},
    done:{type:Boolean,default:false}
  });
  
export const Chat = mongoose.model('Chat', ChatSchema);