Client-side JavaScript console script that extracts the member list from a Telegram group via Telegram Web .  No API keys, no MTProto or user account.
<br>

<img width="815" height="371" alt="Screenshot From 2026-11-09 13-23-11" src="https://github.com/user-attachments/assets/22bd0ac3-c403-4bd9-8812-92294fe7ebf5" />


## Features

- Extracts all group members visible to the Telegram Web K client
- Deduplicates by `data-peer-id`, so users with identical display names are not collapsed
- Captures `name`, `@username`, `last seen` status, and numeric `peerId`
- Flags and filters out **Deleted Accounts** and **bots**
- Auto-scrolls until the end of the list is reached
- Exports to CSV and copies JSON to clipboard

---


### 1. Open the member list

1. Click the group in your chat list
2. Click the **group name / header** 
3. Click **"Members"** (or the member count) → the member rows load

### 2. Run the script

Open DevTools (`F12` or `Ctrl+Shift+I`) → **Console** tab → paste the contents of [`scraper.js`](./scraper.js) → press **Enter**.

### 3. Collect results

- JSON is copied to your clipboard
- `tg_members.csv` is downloaded automatically

---

## Configuration

| Variable    | Default | Meaning                                                        |
| ----------- | ------- | -------------------------------------------------------------- |
| `PAUSE`     | `1400`  | ms between scrolls. Increase for slow networks / large groups. |
| `MAX_IDLE`  | `12`    | Consecutive empty scrolls before giving up.                    |
| `MAX_LOOPS` | `10`    | Hard safety ceiling on total iterations.                       |
