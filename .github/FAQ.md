# FAQ (Frequently Asked Questions)

## DiscordAPIError: Unknown Message

**Why:** The removemessages function tries to delete an message which is not aviable by the discord api
**Fix:** Disable verbose _(extended error logging)_. `verbose: false` in the AntiSpamClient options.

## Bot doesn't kick someone when he rejoins back

**Why:** The package isn't coded to do that. You would need to reset the cache on each sanction
**Fix:** [Reset function!](https://discord-anti-spam.js.org/AntiSpamClient.html#reset)
