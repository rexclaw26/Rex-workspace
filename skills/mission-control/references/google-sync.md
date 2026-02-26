# Google Workspace Sync

## OAuth Setup

```typescript
// Required Google API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',      // Tasks → Sheets
  'https://www.googleapis.com/auth/calendar',           // Calendar sync
  'https://www.googleapis.com/auth/drive.file',         // Memory → Drive
];
```

**Setup steps:**
1. Create project in Google Cloud Console
2. Enable: Sheets API, Calendar API, Drive API
3. Create OAuth 2.0 credentials (Web application)
4. Store `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` in `.env.local` — never in code
5. Implement token refresh flow (access tokens expire in 1 hour)

---

## Tasks → Google Sheets

**Sync direction:** Convex → Sheets (Sheets is read-only backup)

```typescript
// lib/google.ts — sync a task to Sheets
async function syncTaskToSheet(task: Task) {
  const sheets = await getGoogleSheetsClient();
  const row = [
    task._id,
    task.title,
    task.status,
    task.priority,
    task.agentCodename,
    task.dueDate ? new Date(task.dueDate).toISOString() : '',
    new Date(task.updatedAt).toISOString(),
  ];
  // Append or update row by task ID
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Tasks!A:G',
    valueInputOption: 'RAW',
    requestBody: { values: [row] },
  });
}
```

**Sheet columns:** ID | Title | Status | Priority | Agent | Due Date | Last Updated

---

## Calendar → Google Calendar (Two-Way)

**Sync direction:** Two-way with Convex as primary source of truth on conflict.

```typescript
// Push Convex event to Google Calendar
async function pushEventToGoogle(event: CalendarEvent) {
  const calendar = await getGoogleCalendarClient();
  const googleEvent = {
    summary: event.title,
    start: { dateTime: new Date(event.start).toISOString() },
    end: { dateTime: new Date(event.end).toISOString() },
    colorId: getGoogleColorId(event.type),
  };
  if (event.googleEventId) {
    await calendar.events.update({
      calendarId: 'primary',
      eventId: event.googleEventId,
      requestBody: googleEvent,
    });
  } else {
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: googleEvent,
    });
    // Store returned Google event ID in Convex
    await convex.mutation('calendar.setGoogleId', {
      id: event._id,
      googleEventId: result.data.id,
    });
  }
}
```

**Conflict rule:** If the same event is edited in both Convex and Google Calendar before sync, **Convex wins** — overwrite Google.

---

## Memory → Google Drive

**Sync direction:** Convex → Drive (Drive is archive/backup)

Each memory entry → Markdown file in a designated Google Drive folder.

```typescript
async function syncMemoryToDrive(memory: Memory) {
  const drive = await getGoogleDriveClient();
  const content = `# Memory Entry\n\nCategory: ${memory.category}\nTags: ${memory.tags.join(', ')}\nDate: ${new Date(memory.createdAt).toISOString()}\n\n---\n\n${memory.content}`;

  const file = {
    name: `${memory._id}.md`,
    mimeType: 'text/plain',
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  };

  if (memory.googleDriveId) {
    await drive.files.update({
      fileId: memory.googleDriveId,
      media: { mimeType: 'text/plain', body: content },
    });
  } else {
    const result = await drive.files.create({
      requestBody: file,
      media: { mimeType: 'text/plain', body: content },
    });
    await convex.mutation('memory.setDriveId', {
      id: memory._id,
      googleDriveId: result.data.id,
    });
  }
}
```

---

## Environment Variables Required

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_SHEET_ID=
GOOGLE_CALENDAR_ID=primary
GOOGLE_DRIVE_FOLDER_ID=
```

**Never commit `.env.local` — add to `.gitignore`**
