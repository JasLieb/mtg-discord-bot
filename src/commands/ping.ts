import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createCommand } from "~/utils/command.ts";

export default createCommand({
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: "Pong!", ephemeral: true });
  },
});
