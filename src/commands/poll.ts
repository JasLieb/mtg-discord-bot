import { SlashCommandBuilder } from "discord.js";
import { createCommand } from "~/utils/command.ts";

export default createCommand({
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a new poll"),
  async execute(interaction) {
    const pollData = {
      allowMultiselect: true,
      answers: [
        { text: "Lundi", emoji: "1️⃣" },
        { text: "Mardi", emoji: "2️⃣" },
        { text: "Mercredi", emoji: "3️⃣" },
        { text: "Jeudi", emoji: "4️⃣" },
        { text: "Vendredi", emoji: "5️⃣" },
        { text: "Samedi journée", emoji: "6️⃣" },
        { text: "Samedi soirée", emoji: "7️⃣" },
        { text: "Dimanche journée", emoji: "8️⃣" },
        { text: "Dimanche soirée", emoji: "9️⃣" },
      ],
      duration: 7 * 24,
      question: { text: "Quand voulez-vous faire le rendez-vous ?" },
    };

    interaction
      .reply({
        poll: pollData,
      })
      .then(console.log)
      .catch(console.error);
  },
});
