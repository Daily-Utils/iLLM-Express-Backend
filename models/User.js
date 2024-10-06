import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  name: { type: String },
  email: { type: String, unique: true, required: true },
  profileImage: { type: String },
  tier: { type: String, default: 'Free' },
  credits: { type: String, default: '10' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  localGoogleId: { type: String, unique: true },
  googleResourceId: { type: String, unique: true },
  LocalGoogleCredential: { type: mongoose.Schema.Types.ObjectId, ref: 'LocalGoogleCredential' },
  DiscordWebhook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiscordWebhook' }],
  Notion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notion' }],
  Slack: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slack' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Connections' }],
  workflows: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflows' }]
});

export const User = mongoose.model('User', UserSchema);
