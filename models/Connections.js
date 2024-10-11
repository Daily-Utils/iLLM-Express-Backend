import mongoose from "mongoose";

const ConnectionsSchema = new mongoose.Schema({
    type: { type: String, unique: true, required: true },
    discordWebhookId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscordWebhook' },
    notionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notion' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    slackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slack' }
  });
  
export  const Connections = mongoose.model('Connections', ConnectionsSchema);
