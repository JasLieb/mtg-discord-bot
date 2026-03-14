import { MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";
import { createCommand } from "~/utils/command.ts";

function getNextMonday(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)

  const diff = (1 + 7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);

  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default createCommand({
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a new poll")
    .addStringOption((option) =>
      option
        .setName("min-player")
        .setDescription(
          "The minimum number of player to trigger the organization",
        )
        .setRequired(true),
    ),
  async execute(interaction) {
    const channel = await interaction.channel?.fetch();
    const isGeneralChannel = channel?.id === "1480949286517866637";
    if (!isGeneralChannel || !(channel instanceof TextChannel)) {
      await interaction.reply({
        content: "Cannot create a poll in this channel.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const nextMonday = getNextMonday();

    const pollData = {
      allowMultiselect: true,
      answers: [
        {
          text: `Lundi ${nextMonday.toLocaleDateString("fr-FR")}`,
          emoji: "1️⃣",
        },
        {
          text: `Mardi ${addDays(nextMonday, 1).toLocaleDateString("fr-FR")}`,
          emoji: "2️⃣",
        },
        {
          text: `Mercredi ${addDays(nextMonday, 2).toLocaleDateString("fr-FR")}`,
          emoji: "3️⃣",
        },
        {
          text: `Jeudi ${addDays(nextMonday, 3).toLocaleDateString("fr-FR")}`,
          emoji: "4️⃣",
        },
        {
          text: `Vendredi ${addDays(nextMonday, 4).toLocaleDateString("fr-FR")}`,
          emoji: "5️⃣",
        },
        {
          text: `Samedi ${addDays(nextMonday, 5).toLocaleDateString("fr-FR")} journée`,
          emoji: "6️⃣",
        },
        {
          text: `Samedi ${addDays(nextMonday, 5).toLocaleDateString("fr-FR")} soirée`,
          emoji: "7️⃣",
        },
        {
          text: `Dimanche ${addDays(nextMonday, 6).toLocaleDateString("fr-FR")} journée`,
          emoji: "8️⃣",
        },
        {
          text: `Dimanche ${addDays(nextMonday, 6).toLocaleDateString("fr-FR")} soirée`,
          emoji: "9️⃣",
        },
      ],
      duration: 7 * 24,
      question: {
        text: `Semaine du ${nextMonday.toLocaleDateString("fr-FR")} - Quand voulez-vous faire le rendez-vous ? (${interaction.options.getString("min-player")} joueurs)`,
      },
    };

    interaction
      .reply({
        poll: pollData,
      })
      .then(console.log)
      .catch(console.error);
  },
});
