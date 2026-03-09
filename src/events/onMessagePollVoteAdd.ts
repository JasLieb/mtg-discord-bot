import { ChannelType, Events, TextChannel } from "discord.js";
import { createEvent } from "~/utils/event.ts";

// Cases to handle :
// - A user votes for a poll, we create a thread with all the voters to let them organize their event
// - after thread creation, add new vote add the voter to the thread

export default createEvent({
  event: Events.MessagePollVoteAdd,
  async execute(answer) {
    console.log("A vote was added to a message poll!", answer);
    console.log("Poll:", answer.poll);
    const fetchedPoll = await answer.poll.fetch();
    const result = await answer.voters.fetch();

    const message = answer.poll.message;
    const channel = message.channel;

    if (!(channel instanceof TextChannel)) return;

    // création d'un thread indépendant du message
    const newThread = await channel.threads.create({
      name: fetchedPoll.question.text || "Poll voters",
      autoArchiveDuration: 1440,
      type: ChannelType.PublicThread,
    });
    await Promise.all(
      result.values().map((user) => newThread.members.add(user)),
    );

    const messageContent = `Hello players ! This thread has been created to let you organize your event!`;

    await newThread.send({
      content: messageContent,
      allowedMentions: {
        users: result.map((e) => e.id),
      },
    });
  },
});
