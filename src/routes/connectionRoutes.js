import express from "express";
import {
  getUserData,
  onDiscordConnect,
  getDiscordConnectionUrl,
  postContentToWebHook,
  onNotionConnect,
  getNotionConnection,
  getNotionDatabase,
  onCreateNewPageInDatabase,
  onSlackConnect,
  getSlackConnection,
  listBotChannels,
  postMessageToSlack,
} from "../controllers/connectionController.js";

const router = express.Router();

//DISCORD
router.post("/discord/connect", onDiscordConnect);
router.get("/discord/connection-url/:id", getDiscordConnectionUrl);
router.post("/discord/post", postContentToWebHook);

//NOTION
router.post("/notion/connect", onNotionConnect);
router.get("/notion/connection/:id", getNotionConnection);
router.post("/notion/database", getNotionDatabase);
router.post("/notion/page", onCreateNewPageInDatabase);

//SLACK
router.post("/slack/connect", onSlackConnect);
router.get("/slack/connection", getSlackConnection);
router.post("/slack/channels", listBotChannels);
router.post("/slack/message", postMessageToSlack);

router.get("/user/:id", getUserData);

export default router;
