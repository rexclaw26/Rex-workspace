// app/api/calendar-invite/route.ts
// Sends a calendar invite email via Resend when a task is created with an email invite address.

import { NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

interface InvitePayload {
  to:          string;
  taskTitle:   string;
  datetime?:   string;   // ISO string e.g. "2026-03-07T09:00"
  description?: string;
}

function formatDatetime(dt?: string): string {
  if (!dt) return "No date/time set";
  const d = new Date(dt);
  return d.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }) + " at " + d.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Los_Angeles",
  }) + " PST";
}

function buildHtml(payload: InvitePayload): string {
  const { taskTitle, datetime, description } = payload;
  const when = formatDatetime(datetime);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0B1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1120;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1A2535;border-radius:12px;border:1px solid #2A3A50;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1A2535,#0F172A);padding:28px 32px;border-bottom:1px solid #2A3A50;">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#F97316;text-transform:uppercase;">
                Hit Network · Mission Control
              </p>
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#F1F0EE;line-height:1.2;">
                📅 You've been invited
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">

              <!-- Task name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(249,115,22,0.07);border:1px solid rgba(249,115,22,0.2);border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px 0;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#F97316;text-transform:uppercase;">Task / Meeting</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#F1F0EE;">${taskTitle}</p>
                  </td>
                </tr>
              </table>

              <!-- When -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:0 0 6px 0;">
                    <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#8B9CB6;text-transform:uppercase;">When</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#C4B5A5;">${when}</p>
                  </td>
                </tr>
              </table>

              ${description ? `
              <!-- Description -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:0 0 6px 0;">
                    <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#8B9CB6;text-transform:uppercase;">Details</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0;font-size:14px;color:#C4B5A5;line-height:1.6;">${description}</p>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- Footer note -->
              <p style="margin:24px 0 0 0;font-size:12px;color:#4A5568;line-height:1.6;border-top:1px solid #2A3A50;padding-top:20px;">
                This invitation was sent by Kelly at <strong style="color:#8B9CB6;">Hit Network</strong> via Mission Control.
                Reply to this email if you have any questions.
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  let payload: InvitePayload;
  try {
    payload = await request.json();
    if (!payload.to || !payload.taskTitle) throw new Error("Missing required fields");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const subject = payload.datetime
    ? `Invited: ${payload.taskTitle} — ${formatDatetime(payload.datetime)}`
    : `Invited: ${payload.taskTitle}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    "Hit Network <onboarding@resend.dev>",
        to:      [payload.to],
        subject,
        html:    buildHtml(payload),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend ${res.status}: ${err.slice(0, 200)}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[calendar-invite]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
