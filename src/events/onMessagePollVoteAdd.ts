import { Events } from "discord.js";
import { createEvent } from "~/utils/event.ts";

export default createEvent({
  event: Events.MessagePollVoteAdd,
  async execute(answer) {
    console.log("A vote was added to a message poll!", answer);
  },
});
