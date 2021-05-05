# FAQ (Frequently Asked Questions)

## DiscordAPIError: Unknown Message

**Why:** The removemessages function tries to delete an message which is not aviable by the discord api
**Fix:** Disable verbose _(extended error logging)_. `verbose: false` in the AntiSpamClient options.
