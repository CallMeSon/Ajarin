import { Resend } from "resend";
import { EMAIL } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// ─────────────────────────────────────────────
// Core Send Function with Retry
// ─────────────────────────────────────────────

/**
 * Kirim email dengan retry logic (SRS §6.4).
 * 2 kali retry dengan interval 5 menit jika gagal.
 */
async function sendEmailWithRetry(
  options: SendEmailOptions,
  attempt = 1
): Promise<void> {
  try {
    const { error } = await resend.emails.send({
      from: EMAIL.FROM_ADDRESS,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    if (attempt <= EMAIL.MAX_RETRIES) {
      console.warn(
        `[Email] Gagal kirim ke ${options.to}, retry ${attempt}/${EMAIL.MAX_RETRIES}...`,
        err
      );
      await new Promise((resolve) =>
        setTimeout(resolve, EMAIL.RETRY_INTERVAL_MS)
      );
      return sendEmailWithRetry(options, attempt + 1);
    }
    console.error(`[Email] Gagal kirim setelah ${EMAIL.MAX_RETRIES} retry:`, err);
    // Tidak throw — gagal kirim email tidak boleh break flow utama
  }
}

// ─────────────────────────────────────────────
// NE-01: Proposal Baru (ke Mentee)
// ─────────────────────────────────────────────

export async function sendNewProposalEmail(params: {
  menteeEmail: string;
  menteeName: string;
  mentorName: string;
  requestTitle: string;
  requestId: number;
}) {
  await sendEmailWithRetry({
    to: params.menteeEmail,
    subject: `Ada mentor baru yang apply ke request Anda`,
    html: `
      <h2>Hai ${params.menteeName},</h2>
      <p><strong>${params.mentorName}</strong> baru saja mengirim proposal ke request Anda:</p>
      <blockquote><em>"${params.requestTitle}"</em></blockquote>
      <p>Buka dashboard untuk melihat detail proposal dan memilih mentor terbaik.</p>
      <a href="${process.env.NEXTAUTH_URL}/requests/${params.requestId}" style="background:#3525cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
        Lihat Proposal
      </a>
      <p style="margin-top:24px;color:#777;font-size:14px;">— Tim Ajarin</p>
    `,
  });
}

// ─────────────────────────────────────────────
// NE-02: Proposal Diterima (ke Mentor terpilih)
// ─────────────────────────────────────────────

export async function sendProposalAcceptedEmail(params: {
  mentorEmail: string;
  mentorName: string;
  menteeName: string;
  requestTitle: string;
  matchId: number;
}) {
  await sendEmailWithRetry({
    to: params.mentorEmail,
    subject: `Selamat! Proposal Anda diterima oleh Mentee`,
    html: `
      <h2>Selamat, ${params.mentorName}! 🎉</h2>
      <p><strong>${params.menteeName}</strong> memilih Anda sebagai mentor untuk request:</p>
      <blockquote><em>"${params.requestTitle}"</em></blockquote>
      <p>Chat sudah terbuka. Hubungi Mentee untuk koordinasi jadwal dan sesi.</p>
      <a href="${process.env.NEXTAUTH_URL}/chat/${params.matchId}" style="background:#3525cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
        Buka Chat
      </a>
      <p style="margin-top:24px;color:#777;font-size:14px;">— Tim Ajarin</p>
    `,
  });
}

// ─────────────────────────────────────────────
// NE-03: Proposal Ditolak (ke Mentor lain)
// ─────────────────────────────────────────────

export async function sendProposalRejectedEmail(params: {
  mentorEmail: string;
  mentorName: string;
  requestTitle: string;
}) {
  await sendEmailWithRetry({
    to: params.mentorEmail,
    subject: `Pembaruan status proposal Anda di Ajarin`,
    html: `
      <h2>Hai ${params.mentorName},</h2>
      <p>Mentee sudah memilih mentor lain untuk request:</p>
      <blockquote><em>"${params.requestTitle}"</em></blockquote>
      <p>Jangan menyerah! Masih banyak request aktif yang menunggu proposal Anda.</p>
      <a href="${process.env.NEXTAUTH_URL}/requests" style="background:#3525cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
        Lihat Request Lainnya
      </a>
      <p style="margin-top:24px;color:#777;font-size:14px;">— Tim Ajarin</p>
    `,
  });
}

// ─────────────────────────────────────────────
// NE-04: Pesan Baru di Chat
// ─────────────────────────────────────────────

export async function sendNewMessageEmail(params: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  matchId: number;
}) {
  await sendEmailWithRetry({
    to: params.recipientEmail,
    subject: `Anda memiliki pesan baru di Ajarin`,
    html: `
      <h2>Hai ${params.recipientName},</h2>
      <p><strong>${params.senderName}</strong> mengirim pesan baru untuk Anda.</p>
      <a href="${process.env.NEXTAUTH_URL}/chat/${params.matchId}" style="background:#3525cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
        Balas Pesan
      </a>
      <p style="margin-top:24px;color:#777;font-size:14px;">— Tim Ajarin</p>
    `,
  });
}

// ─────────────────────────────────────────────
// NE-05: Request Belum Mendapat Proposal (H+7)
// ─────────────────────────────────────────────

export async function sendRequestNoProposalEmail(params: {
  menteeEmail: string;
  menteeName: string;
  requestTitle: string;
  requestId: number;
}) {
  await sendEmailWithRetry({
    to: params.menteeEmail,
    subject: `Request Anda belum mendapat proposal`,
    html: `
      <h2>Hai ${params.menteeName},</h2>
      <p>Request Anda belum mendapat proposal setelah 7 hari:</p>
      <blockquote><em>"${params.requestTitle}"</em></blockquote>
      <p>Request Anda telah <strong>ditutup secara otomatis</strong>. Anda dapat membuat request baru dengan deskripsi atau budget yang lebih menarik.</p>
      <a href="${process.env.NEXTAUTH_URL}/requests/new" style="background:#3525cd;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">
        Buat Request Baru
      </a>
      <p style="margin-top:24px;color:#777;font-size:14px;">— Tim Ajarin</p>
    `,
  });
}
