import { ChannelType, Events, TextChannel } from "discord.js";
import { createEvent } from "~/utils/event.ts";

export default createEvent({
  event: Events.MessagePollVoteAdd,
  async execute(answer) {
    console.log("A vote was added to a message poll!", answer);
    console.log("Poll:", await answer.poll.fetch());
    const result = await answer.voters.fetch();

    const pollMessage = await answer.poll.message.fetch();

    const fullAnswer = pollMessage.poll?.answers.get(answer.id);

    const minPlayer = parseInt(
      pollMessage?.poll?.question.text?.match(/\((\d+) joueurs\)/)?.[1] ?? "0",
      6,
    );

    const channel = await pollMessage.client.channels.cache.get(
      "1480627969377698004",
    );

    if (minPlayer > result.size || !(channel instanceof TextChannel)) return;

    const threadName =
      fullAnswer?.text ??
      "Error during thread creation, replace me like Day DD/MM/YYYY [journée|soirée]";

    const threads = await channel.threads.fetchActive();
    let isCreatedThread = false;
    let thread = threads.threads.find((thread) =>
      thread.name.startsWith(threadName),
    );
    if (!thread) {
      isCreatedThread = true;
      thread = await channel.threads.create({
        name: threadName,
        autoArchiveDuration: 1440,
        type: ChannelType.PublicThread,
      });
    }
    await Promise.all(result.values().map((user) => thread.members.add(user)));

    if (!isCreatedThread) return;
    const messageContent = `Hello players ! This thread has been created to let you organize your event!`;

    await thread.send({
      content: messageContent,
      allowedMentions: {
        users: result.map((e) => e.id),
      },
    });
  },
});
