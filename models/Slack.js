import mongoose from "mongoose";

const SlackSchema = new mongoose.Schema({
    appId: { type: String },
    authedUserId: { type: String },
    authedUserToken: { type: String, unique: true, required: true },
    slackAccessToken: { type: String, unique: true, required: true },
    botUserId: { type: String },
    teamId: { type: String },
    teamName: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connections' }]
  });
  
export const Slack = mongoose.model('Slack', SlackSchema);
  