import asyncio
import smtplib
from email.message import EmailMessage
from typing import Optional
from app.core.config import settings

# Simple templating functions for summary emails.

SUMMARY_SUBJECT = "Meeting Summary: {meeting_title}"

SUMMARY_TEMPLATE = """Hello {display_name},

Here is the meeting summary for "{meeting_title}":

Executive summary:
{executive_summary}

Key action items:
{action_items}

Decisions:
{decisions}

Risks / blockers:
{risks}

{transcript_section}
Best,
Meeting Intelligence
"""


class EmailSender:
    def __init__(self):
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.user = settings.SMTP_USER
        self.passwd = settings.SMTP_PASS
        self.from_addr = settings.EMAIL_FROM

    def _build_message(self, to_addr: str, subject: str, body: str) -> EmailMessage:
        msg = EmailMessage()
        msg["From"] = self.from_addr or "no-reply@example.com"
        msg["To"] = to_addr
        msg["Subject"] = subject
        msg.set_content(body)
        return msg

    def _send_sync(self, to_addr: str, subject: str, body: str):
        msg = self._build_message(to_addr, subject, body)
        if not self.host:
            # fallback: print to console
            print("[EMAIL MOCK] To:", to_addr)
            print("Subject:", subject)
            print(body)
            return True
        # send via SMTP
        try:
            if self.port and int(self.port) == 465:
                server = smtplib.SMTP_SSL(self.host, int(self.port))
            else:
                server = smtplib.SMTP(self.host, self.port or 25)
                server.starttls()
            if self.user and self.passwd:
                server.login(self.user, self.passwd)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as exc:
            raise

    async def send(self, to_addr: str, subject: str, body: str) -> bool:
        return await asyncio.to_thread(self._send_sync, to_addr, subject, body)


async def format_summary_email(user_display_name: str, user_email: str, meeting_title: str, summary: dict, include_transcript_link: Optional[str] = None) -> tuple:
    action_items = "\n".join([f"- {it}" for it in summary.get("key_points", [])]) or "None"
    decisions = "\n".join([f"- {d}" for d in summary.get("decisions", [])]) or "None"
    risks = "\n".join([f"- {r}" for r in summary.get("risks", [])]) or "None"
    transcript_section = ""
    if include_transcript_link:
        transcript_section = f"Transcript: {include_transcript_link}\n\n"
    body = SUMMARY_TEMPLATE.format(
        display_name=user_display_name or user_email,
        meeting_title=meeting_title,
        executive_summary=summary.get("executive_summary", ""),
        action_items=action_items,
        decisions=decisions,
        risks=risks,
        transcript_section=transcript_section,
    )
    subject = SUMMARY_SUBJECT.format(meeting_title=meeting_title)
    return subject, body


# convenience singleton
sender = EmailSender()
