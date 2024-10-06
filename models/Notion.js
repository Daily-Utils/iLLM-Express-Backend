import mongoose from "mongoose";

const NotionSchema = new mongoose.Schema({
    accessToken: { type: String, unique: true, required: true },
    workspaceId: { type: String, unique: true, required: true },
    databaseId: { type: String, unique: true, required: true },
    workspaceName: { type: String },
    workspaceIcon: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connections' }]
  });
  
export  const Notion = mongoose.model('Notion', NotionSchema);
  