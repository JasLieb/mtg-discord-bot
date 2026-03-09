import { ClientEvents } from "discord.js";

export interface EventConfig<Event extends keyof ClientEvents> {
  event: Event;
  execute: (...args: ClientEvents[Event]) => Promise<void> | void;
}

/** Create an event for your application.
 *
 * @see https://discordjs.guide/creating-your-bot/slash-commands.html#individual-command-files
 */
export const createEvent = <Event extends keyof ClientEvents>(
  eventConfig: EventConfig<Event>,
) => eventConfig;
