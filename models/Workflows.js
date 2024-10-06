import mongoose from "mongoose";

const WorkflowsSchema = new mongoose.Schema({
    nodes: { type: String },
    edges: { type: String },
    name: { type: String, required: true },
    discordTemplate: { type: String },
    notionTemplate: { type: String },
    slackTemplate: { type: String },
    slackChannels: [{ type: String }],
    slackAccessToken: { type: String },
    notionAccessToken: { type: String },
    notionDbId: { type: String },
    flowPath: { type: String },
    cronPath: { type: String },
    publish: { type: Boolean, default: false },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
export const Workflows = mongoose.model('Workflows', WorkflowsSchema);