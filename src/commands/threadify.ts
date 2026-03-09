import { ChannelType, SlashCommandBuilder } from "discord.js";
import { createCommand } from "~/utils/command.ts";

export default createCommand({
  data: new SlashCommandBuilder()
    .setName("threadify")
    .setDescription("Creates a private thread in the current channel"),
  async execute(interaction) {
    if (!interaction.channel) {
      await interaction.reply({
        content: "You must be in a channel to use this command!",
        ephemeral: true,
      });
      return;
    }

    if (interaction.channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "You must be in a text channel to use this command!",
        ephemeral: true,
      });
      return;
    }

    const newThread = await interaction.channel.threads.create({
      name: "Some new thread",
      type: ChannelType.PrivateThread,
      reason: "Created by a bot",
    });

    await newThread.members.add(interaction.user);

    await newThread.send({
      content: "Hello, I'm a new thread!",
      allowedMentions: {
        users: [interaction.user.id],
      },
    });

    await interaction.reply({
      content: `Created a new thread in ${newThread.name}`,
      ephemeral: true,
    });
  },
});
