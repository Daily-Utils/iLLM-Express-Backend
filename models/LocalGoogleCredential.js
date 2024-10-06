import mongoose from "mongoose";

const LocalGoogleCredentialSchema = new mongoose.Schema({
    accessToken: { type: String, unique: true, required: true },
    folderId: { type: String },
    pageToken: { type: String },
    channelId: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
    subscribed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }
  });
  
export  const LocalGoogleCredential = mongoose.model('LocalGoogleCredential', LocalGoogleCredentialSchema);
  