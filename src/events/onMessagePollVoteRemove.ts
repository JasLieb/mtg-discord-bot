import { Events } from "discord.js";
import { createEvent } from "~/utils/event.ts";

export default createEvent({
  event: Events.MessagePollVoteRemove,
  async execute(answer) {
    console.log("A vote was removed from a message poll!", answer);
  },
});
