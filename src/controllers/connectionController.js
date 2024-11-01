import { DiscordWebhook } from "../models/DiscordWebhook.js";
import { Connections } from "../models/Connections.js";
import { Notion } from "../models/Notion.js";
import { Client } from "@notionhq/client";
import { Slack } from "../models/Slack.js";
import { User } from "../models/User.js";
import axios from "axios";

//Discord
export const onDiscordConnect = async (req, res) => {
  try {
    const {
      channel_id,
      webhook_id,
      webhook_name,
      webhook_url,
      id,
      guild_name,
      guild_id,
    } = req.body;

    if (webhook_id) {
      // Check if a webhook exists for the user
      const webhook = await DiscordWebhook.findOne({ user: id }).populate(
        "connections"
      );

      // If webhook does not exist, create it
      if (!webhook) {
        const newWebhook = new DiscordWebhook({
          user: id,
          webhookId: webhook_id,
          channelId: channel_id,
          guildId: guild_id,
          name: webhook_name,
          url: webhook_url,
          guildName: guild_name,
        });

        const newConnection = new Connections({
          userId: id,
          type: "Discord",
          discordWebhookId: newWebhook._id,
        });

        newWebhook.connections.push(newConnection._id);

        await newWebhook.save();
        await newConnection.save();
      } else {
        // Check if the webhook exists for the target channel ID
        const webhookChannel = await DiscordWebhook.findOne({
          channelId: channel_id,
        });

        if (!webhookChannel) {
          const newWebhook = new DiscordWebhook({
            user: id,
            webhookId: webhook_id,
            channelId: channel_id,
            guildId: guild_id,
            name: webhook_name,
            url: webhook_url,
            guildName: guild_name,
          });

          const newConnection = new Connections({
            userId: id,
            type: "Discord",
            discordWebhookId: newWebhook._id,
          });

          newWebhook.connections.push(newConnection._id);

          await newWebhook.save();
          await newConnection.save();
        }
      }
      res.status(200).json({ message: "Webhook connected successfully" });
    } else {
      res.status(400).json({ message: "Invalid webhook_id" });
    }
  } catch (error) {
    console.error("Error connecting discord:", error);
    return res.status(500).send("Error connecting Discord");
  }
};

export const getDiscordConnectionUrl = async (req, res) => {
  const id = req.params;

  if (id) {
    const webhook = await DiscordWebhook.findOne({ user: id }).select(
      "url name guildName"
    );

    if (webhook) {
      res.status(200).json(webhook);
    } else {
      res.status(404).json({ message: "No webhook found for user" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const postContentToWebHook = async (req, res) => {
  const { content, url } = req.body;

  if (content) {
    try {
      const response = await axios.post(url, { content });
      if (response.status === 200) {
        res.status(200).json({ message: "Success" });
      } else {
        res.status(500).json({ message: "Failed to post content" });
      }
    } catch (error) {
      res.status(500).json({ message: "Request failed", error });
    }
  } else {
    res.status(400).json({ message: "Content is empty" });
  }
};

//Notion
export const onNotionConnect = async (req, res) => {
  const {
    access_token,
    workspace_id,
    workspace_icon,
    workspace_name,
    database_id,
    id,
  } = req.body;

  if (access_token) {
    try {
      // Check if Notion is already connected
      const notionConnected = await Notion.findOne({
        accessToken: access_token,
      }).populate("connections");

      if (!notionConnected) {
        // Create new Notion connection
        const newNotion = new Notion({
          user: id,
          accessToken: access_token,
          workspaceIcon: workspace_icon,
          workspaceId: workspace_id,
          workspaceName: workspace_name,
          databaseId: database_id,
        });

        const newConnection = new Connections({
          userId: id,
          type: "Notion",
          notionId: newNotion._id,
        });

        newNotion.connections.push(newConnection._id);

        await newNotion.save();
        await newConnection.save();

        res.status(200).json({ message: "Notion connected successfully" });
      } else {
        res.status(200).json({ message: "Notion is already connected" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to connect Notion", error });
    }
  } else {
    res.status(400).json({ message: "Missing access token" });
  }
};

export const getNotionConnection = async (req, res) => {
  const id = req.params;

  if (id) {
    try {
      const connection = await Notion.findOne({ user: id });

      if (connection) {
        res.status(200).json(connection);
      } else {
        res.status(404).json({ message: "No Notion connection found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to retrieve Notion connection", error });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const getNotionDatabase = async (req, res) => {
  const { databaseId, accessToken } = req.body;

  const notion = new Client({ auth: accessToken });

  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve Notion database", error });
  }
};

export const onCreateNewPageInDatabase = async (req, res) => {
  const { databaseId, accessToken, content } = req.body;

  const notion = new Client({ auth: accessToken });

  try {
    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: databaseId,
      },
      properties: {
        name: [
          {
            text: {
              content: content,
            },
          },
        ],
      },
    });

    if (response) {
      res.status(200).json(response);
    } else {
      res
        .status(500)
        .json({ message: "Failed to create a new page in the database" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create a new page", error });
  }
};

//SLACK
export const onSlackConnect = async (req, res) => {
  const {
    app_id,
    authed_user_id,
    authed_user_token,
    slack_access_token,
    bot_user_id,
    team_id,
    team_name,
    user_id,
  } = req.body;

  if (!slack_access_token)
    return res.status(400).json({ message: "Slack access token missing" });

  try {
    // Check if Slack connection already exists
    const slackConnection = await Slack.findOne({
      slackAccessToken: slack_access_token,
    }).populate("connections");

    if (!slackConnection) {
      // Create new Slack connection
      const newSlackConnection = new Slack({
        user: user_id,
        appId: app_id,
        authedUserId: authed_user_id,
        authedUserToken: authed_user_token,
        slackAccessToken: slack_access_token,
        botUserId: bot_user_id,
        teamId: team_id,
        teamName: team_name,
      });

      const newConnection = new Connections({
        userId: user_id,
        type: "Slack",
        slackId: newSlackConnection._id,
      });

      newSlackConnection.connections.push(newConnection._id);

      await newSlackConnection.save();
      await newConnection.save();

      res.status(200).json({ message: "Slack connected successfully" });
    } else {
      res.status(200).json({ message: "Slack is already connected" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to connect Slack", error });
  }
};

export const getSlackConnection = async (req, res) => {
  const id = req.params;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  try {
    const slackConnection = await Slack.findOne({ user: id });

    if (!slackConnection) {
      res.status(404).json({ message: "No Slack connection found" });
    } else {
      res.status(200).json(slackConnection);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve Slack connection", error });
  }
};

export const listBotChannels = async (req, res) => {
  const { slackAccessToken } = req.body;

  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: "public_channel,private_channel",
    limit: "200",
  })}`;

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    });

    if (!data.ok) return res.status(400).json({ message: data.error });

    const channels = data.channels
      .filter((ch) => ch.is_member)
      .map((ch) => ({
        label: ch.name,
        value: ch.id,
      }));

    res.status(200).json(channels);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing bot channels", error: error.message });
  }
};

export const postMessageInSlackChannel = async (
  slackAccessToken,
  slackChannel,
  content
) => {
  try {
    const response = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel: slackChannel, text: content },
      {
        headers: {
          Authorization: `Bearer ${slackAccessToken}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );

    if (response.data.ok) {
      console.log(`Message posted successfully to channel ID: ${slackChannel}`);
    } else {
      console.error(
        `Error posting message to Slack channel ${slackChannel}:`,
        response.data.error
      );
    }
  } catch (error) {
    console.error(
      `Error posting message to Slack channel ${slackChannel}:`,
      error.message
    );
  }
};

export const postMessageToSlack = async (req, res) => {
  const { slackAccessToken, selectedSlackChannels, content } = req.body;

  if (!content) return res.status(400).json({ message: "Content is empty" });
  if (!selectedSlackChannels?.length)
    return res.status(400).json({ message: "Channel not selected" });

  try {
    selectedSlackChannels.forEach(async (channel) => {
      await postMessageInSlackChannel(slackAccessToken, channel.value, content);
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Message could not be sent to Slack", error });
  }
};

export const getUserData = async (req, res) => {
  const { id } = req.params;

  try {
    // console.log("id::>",id);

    const user_info = await User.findOne({ clerkId: id }).populate(
      "connections"
    );

    if (!user_info) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user_info);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data", error });
  }
};
