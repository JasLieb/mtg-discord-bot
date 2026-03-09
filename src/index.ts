import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import { env } from "~/utils/env.ts";

import { deployGlobalCommands } from "~/utils/deployGlobalCommands.ts";
import onMessagePollVoteAdd from "./events/onMessagePollVoteAdd.ts";
import onMessagePollVoteRemove from "./events/onMessagePollVoteRemove.ts";

const client = Object.assign(
  new Client({
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
      Partials.Poll,
      Partials.PollAnswer,
    ],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessagePolls,
      GatewayIntentBits.DirectMessagePolls,
    ],
  }),
  {
    commands: await deployGlobalCommands(),
  },
);

client.once(Events.ClientReady, (readyClient) =>
  console.log(`Ready! Logged in as ${readyClient.user.tag}`),
);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred)
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    else
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
  }
});

client.on(onMessagePollVoteAdd.event, (answer, userId) =>
  onMessagePollVoteAdd.execute(answer, userId),
);
client.on(onMessagePollVoteRemove.event, (answer, userId) =>
  onMessagePollVoteRemove.execute(answer, userId),
);

client.login(env.TOKEN);
