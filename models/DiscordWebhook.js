import mongoose from "mongoose";

const DiscordWebhookSchema = new mongoose.Schema({
    webhookId: { type: String, unique: true, required: true },
    url: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    guildName: { type: String, required: true },
    guildId: { type: String, required: true },
    channelId: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connections' }]
  });
  
export const DiscordWebhook = mongoose.model('DiscordWebhook', DiscordWebhookSchema);
  