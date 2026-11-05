# Bot features

## Setup

Copy the keys from `.env.example` into the existing `.env` file and fill in the Discord IDs. `GUILD_SETTINGS` maps each guild ID to its own role and channel IDs, which is necessary because Discord IDs differ between servers. The individual `AUTO_ROLE_ID`, `SUPPORT_ROLE_ID`, `APPLICATION_REVIEW_CHANNEL_ID`, and `APPROVED_ROLE_ID` values remain as single-server fallbacks. Do not share `DISCORD_TOKEN`. Slash commands are registered globally for every server where the bot is installed; global command updates may take time to appear.

Enable **Server Members Intent** in the Discord Developer Portal. The bot also needs the following permissions in each server:

- View Channels, Send Messages, and Read Message History for welcome messages, XP level-ups, and raid alerts.
- Manage Roles, with the bot's highest role above `AUTO_ROLE_ID` and `APPROVED_ROLE_ID`, for automatic and approved-role assignment.
- Manage Channels to create and delete support-ticket channels.

`autoRoleId` (or the `AUTO_ROLE_ID` fallback) is optional and is assigned to every human who joins that server. Set it to the Meclis Üyesi role only if every new member should receive that role. A failed role assignment does not suppress the welcome message.

## Welcome and leveling

A new human member is welcomed in the text channel with the lowest position. XP is awarded randomly between 15 and 25, at most once per member per minute. Level data is stored in the ignored local file `data/levels.json`; it survives restarts on this host. `/level` displays the member's progress. The first level requires 100 XP; later levels require 100 additional XP each.

## Support and applications

`/destek` creates one private channel per requester. Set `supportRoleId` (or the `SUPPORT_ROLE_ID` fallback) so the support team can see those channels. The requester or a member with Manage Channels can use `/kapat`.

`/basvuru` opens a three-question form. Set `applicationReviewChannelId` to a private staff channel and `approvedRoleId` to the role assigned after approval. Review buttons require Manage Roles; the bot's highest role must be above the approved role. Keep the review channel restricted to staff because submitted answers are posted there.

## Anti-raid and languages

The anti-raid detector posts a rate-limited alert after 5 joins in 10 seconds by default. Change `RAID_JOIN_THRESHOLD` and `RAID_WINDOW_MS` to tune it. It alerts only; it does not automatically kick, ban, or lock down members/channels.

Bot replies and forms are available in Turkish and English, selected from the Discord locale. No user content is sent to an external translation service.

## Integrations not configured yet

The shortcut application endpoint and the existing translation app integration are not wired up yet. Their API URL/path, request and response examples, and authentication type are needed before implementing either integration. Put credentials only in `.env`, never in chat or source control. Arbitrary shell-command execution is intentionally not supported.
