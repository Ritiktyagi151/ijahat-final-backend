const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatMultiline = (value = "") => escapeHtml(value).replace(/\n/g, "<br />");

const fallback = (value, defaultValue = "Not provided") =>
  value === undefined || value === null || value === "" ? defaultValue : value;

const journal = {
  name: "International Journal of Applied Healthcare and Technology",
  shortName: "IJHAT",
  tagline: "Peer-reviewed open access journal for healthcare and technology research",
  websiteUrl: "https://ijhat.org",
  email: "editor@ijhat.org",
  primary: "#0056b3",
  secondary: "#0d9ecf",
};

const socialLink = (label, url) => `
  <a href="${url}" style="display:inline-block;width:30px;height:30px;border-radius:50%;background:#e8f5fb;color:${journal.primary};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;line-height:30px;text-align:center;text-decoration:none;margin:0 3px;">${label}</a>
`;

const detailRow = (label, value) => `
  <tr>
    <td style="padding:11px 14px;border-bottom:1px solid #e8edf3;color:#64748b;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;width:34%;vertical-align:top;">${label}</td>
    <td style="padding:11px 14px;border-bottom:1px solid #e8edf3;color:#1f2937;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;vertical-align:top;">${value}</td>
  </tr>
`;

const emailShell = ({ preheader, headerTitle, children, logoCid = "ijhat-logo", websiteUrl = journal.websiteUrl }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${escapeHtml(headerTitle)}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .email-container { width: 100% !important; }
        .email-padding { padding-left: 18px !important; padding-right: 18px !important; }
        .stack-column { display: block !important; width: 100% !important; }
        .mobile-center { text-align: center !important; }
        .mobile-button { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f7fb;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f7fb;border-collapse:collapse;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:640px;max-width:640px;background:#ffffff;border-collapse:separate;border-spacing:0;border-radius:16px;overflow:hidden;box-shadow:0 16px 42px rgba(15,35,65,0.12);">
            <tr>
              <td style="background:${journal.primary};background-image:linear-gradient(135deg,${journal.primary},${journal.secondary});padding:26px 30px;" class="email-padding">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td width="82" style="width:82px;vertical-align:middle;">
                      <img src="cid:${logoCid}" width="62" alt="IJHAT Logo" style="display:block;width:62px;height:auto;border:0;background:#ffffff;border-radius:12px;padding:7px;">
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-family:Arial,Helvetica,sans-serif;color:#dff4ff;font-size:12px;line-height:1.35;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">${journal.shortName}</div>
                      <h1 style="margin:5px 0 4px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.28;font-weight:700;">${journal.name}</h1>
                      <p style="margin:0;color:#e8f7ff;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;">${journal.tagline}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${children}
            <tr>
              <td align="center" style="background:#f8fbff;padding:24px 30px 26px;border-top:1px solid #e6edf5;" class="email-padding">
                <p style="margin:0 0 12px;color:#526273;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;">
                  <a href="${websiteUrl}" style="color:${journal.primary};font-weight:700;text-decoration:none;">Visit Website</a>
                  &nbsp;|&nbsp;
                  <a href="mailto:${journal.email}" style="color:${journal.primary};font-weight:700;text-decoration:none;">${journal.email}</a>
                </p>
                <div style="margin:0 0 14px;">
                  ${socialLink("in", "https://www.linkedin.com")}
                  ${socialLink("X", "https://x.com")}
                  ${socialLink("f", "https://www.facebook.com")}
                </div>
                <p style="margin:0;color:#7a8999;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">
                  &copy; ${new Date().getFullYear()} ${journal.name}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

exports.createUserThankYouEmail = ({
  firstName = "{{firstName}}",
  fullName = "{{fullName}}",
  email = "{{email}}",
  subject = "{{subject}}",
  logoCid,
  websiteUrl = journal.websiteUrl,
} = {}) => {
  const safeFirstName = escapeHtml(fallback(firstName, "{{firstName}}"));
  const safeFullName = escapeHtml(fallback(fullName, "{{fullName}}"));
  const safeEmail = escapeHtml(fallback(email, "{{email}}"));
  const safeSubject = escapeHtml(fallback(subject, "{{subject}}"));

  return emailShell({
    logoCid,
    websiteUrl,
    headerTitle: "Thank You for Contacting IJHAT",
    preheader: "We have received your message and our editorial team will review it shortly.",
    children: `
      <tr>
        <td style="padding:30px 34px 8px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td align="center" style="padding:0 0 20px;">
                <div style="width:58px;height:58px;border-radius:50%;background:#e7f8ee;color:#159447;font-family:Arial,Helvetica,sans-serif;font-size:30px;font-weight:700;line-height:58px;text-align:center;">&#10003;</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="background:#eef8ff;border:1px solid #cfeeff;border-radius:12px;padding:15px 18px;">
                <div style="color:${journal.primary};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.5;">Your inquiry has been received successfully.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 34px 6px;" class="email-padding">
          <h2 style="margin:0 0 14px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.35;font-weight:700;">Thank You for Contacting IJHAT</h2>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Dear ${safeFirstName},</p>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Thank you for contacting the ${journal.name} (${journal.shortName}).</p>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">We have successfully received your message and our editorial team will review your inquiry shortly.</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Our team typically responds within 24&ndash;48 business hours.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 34px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #e2eaf3;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#f7fbff;padding:14px 16px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Submission Details</td>
            </tr>
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  ${detailRow("Name", safeFullName)}
                  ${detailRow("Email", `<a href="mailto:${safeEmail}" style="color:${journal.primary};font-weight:700;text-decoration:none;">${safeEmail}</a>`)}
                  ${detailRow("Subject", safeSubject)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:2px 34px 30px;" class="email-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px;">
            <tr>
              <td style="border-radius:8px;background:${journal.primary};">
                <a href="${websiteUrl}" class="mobile-button" style="display:inline-block;padding:13px 22px;color:#ffffff;background:${journal.primary};border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">Visit IJHAT Website</a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 4px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;">Thank you for your interest in our journal.</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;">Best Regards,<br><strong>Editorial Office</strong><br>${journal.name}</p>
        </td>
      </tr>
    `,
  });
};

exports.createAdminNotificationEmail = ({
  fullName = "{{fullName}}",
  email = "{{email}}",
  phone = "",
  subject = "{{subject}}",
  message = "{{message}}",
  date = "{{date}}",
  ipAddress = "",
  viewUrl = journal.websiteUrl,
  logoCid,
  websiteUrl = journal.websiteUrl,
} = {}) => {
  const safeFullName = escapeHtml(fallback(fullName, "{{fullName}}"));
  const safeEmail = escapeHtml(fallback(email, "{{email}}"));
  const safePhone = escapeHtml(fallback(phone));
  const safeSubject = escapeHtml(fallback(subject, "{{subject}}"));
  const safeMessage = formatMultiline(fallback(message, "{{message}}"));
  const safeDate = escapeHtml(fallback(date, "{{date}}"));
  const safeIpAddress = escapeHtml(fallback(ipAddress));

  return emailShell({
    logoCid,
    websiteUrl,
    headerTitle: "New Form Submission Received",
    preheader: "A new IJHAT form submission is waiting for review.",
    children: `
      <tr>
        <td style="padding:30px 34px 12px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td class="stack-column" style="vertical-align:middle;">
                <div style="display:inline-block;background:#e9f7fc;color:${journal.secondary};border:1px solid #ccecf6;border-radius:999px;padding:7px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;">New Inquiry</div>
                <h2 style="margin:14px 0 5px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.32;font-weight:700;">New Submission Notification</h2>
                <p style="margin:0;color:#637487;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;">A new form submission has arrived from the IJHAT website.</p>
              </td>
              <td align="right" class="stack-column mobile-center" style="vertical-align:middle;padding-top:8px;">
                <a href="${viewUrl}" class="mobile-button" style="display:inline-block;background:${journal.primary};border-radius:8px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;padding:12px 18px;text-decoration:none;">View Submission</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 34px 30px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #dfe8f2;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${journal.primary};padding:14px 16px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Submitted Information</td>
            </tr>
            <tr>
              <td style="padding:0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  ${detailRow("Full Name", safeFullName)}
                  ${detailRow("Email", `<a href="mailto:${safeEmail}" style="color:${journal.primary};font-weight:700;text-decoration:none;">${safeEmail}</a>`)}
                  ${detailRow("Phone", safePhone)}
                  ${detailRow("Subject", safeSubject)}
                  ${detailRow("Message", safeMessage)}
                  ${detailRow("Submission Date", safeDate)}
                  ${detailRow("IP Address", safeIpAddress)}
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#68798b;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.65;">This is an automated admin notification from the IJHAT website forms system.</p>
        </td>
      </tr>
    `,
  });
};

exports.createNewsletterSubscriberEmail = ({ email = "{{email}}", logoCid } = {}) =>
  emailShell({
    logoCid,
    headerTitle: "Newsletter Subscription Successful",
    preheader: "Your IJHAT newsletter subscription is active.",
    children: `
      <tr>
        <td style="padding:32px 34px;" class="email-padding">
          <div style="background:#eef8ff;border:1px solid #cfeeff;border-radius:12px;padding:16px 18px;margin-bottom:22px;color:${journal.primary};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">
            Subscription successful
          </div>
          <h2 style="margin:0 0 14px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.35;">Thank you for subscribing to IJHAT</h2>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Your email address <strong>${escapeHtml(email)}</strong> has been successfully added to the IJHAT newsletter.</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">You will receive journal updates, new issue alerts, announcements, publication news, and important author resources from the editorial office.</p>
        </td>
      </tr>
    `,
  });

exports.createNewsletterAdminEmail = ({
  email = "{{email}}",
  date = "{{date}}",
  source = "IJHAT Website",
  logoCid,
} = {}) =>
  emailShell({
    logoCid,
    headerTitle: "New Newsletter Subscriber",
    preheader: "A new visitor subscribed to the IJHAT newsletter.",
    children: `
      <tr>
        <td style="padding:32px 34px;" class="email-padding">
          <div style="display:inline-block;background:#e9f7fc;color:${journal.secondary};border:1px solid #ccecf6;border-radius:999px;padding:7px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;margin-bottom:14px;">New Subscriber</div>
          <h2 style="margin:0 0 16px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.35;">New Newsletter Subscriber</h2>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #dfe8f2;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:${journal.primary};padding:14px 16px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Subscriber Details</td>
            </tr>
            <tr>
              <td style="padding:0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  ${detailRow("Subscriber Email", `<a href="mailto:${escapeHtml(email)}" style="color:${journal.primary};font-weight:700;text-decoration:none;">${escapeHtml(email)}</a>`)}
                  ${detailRow("Date & Time", escapeHtml(date))}
                  ${detailRow("Website Source", escapeHtml(source))}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `,
  });

exports.createManuscriptAcceptedEmail = ({
  authorName = "{{authorName}}",
  articleTitle = "{{articleTitle}}",
  doi = "",
  volume = "",
  issueNumber = "",
  archiveUrl = journal.websiteUrl,
  logoCid,
} = {}) =>
  emailShell({
    logoCid,
    headerTitle: "Manuscript Accepted",
    preheader: "Your IJHAT manuscript has been accepted for publication.",
    children: `
      <tr>
        <td style="padding:32px 34px 8px;" class="email-padding">
          <div style="display:inline-block;background:#e7f8ee;color:#15803d;border:1px solid #bfe9cc;border-radius:999px;padding:8px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;">Accepted</div>
          <h2 style="margin:16px 0 12px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.35;">Manuscript Acceptance Notification</h2>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Dear ${escapeHtml(authorName)},</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">We are pleased to inform you that your manuscript has been accepted for publication in ${journal.shortName}. Thank you for contributing your scholarly work to the journal.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 34px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #dfe8f2;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#f7fbff;padding:14px 16px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Manuscript Details</td>
            </tr>
            <tr>
              <td style="padding:0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  ${detailRow("Title", escapeHtml(articleTitle))}
                  ${detailRow("Status", '<span style="display:inline-block;background:#e7f8ee;color:#15803d;border-radius:999px;padding:5px 10px;font-weight:700;">Accepted</span>')}
                  ${detailRow("DOI", escapeHtml(fallback(doi)))}
                  ${detailRow("Volume", escapeHtml(fallback(volume)))}
                  ${detailRow("Issue", escapeHtml(fallback(issueNumber)))}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:2px 34px 32px;" class="email-padding">
          <a href="${archiveUrl}" class="mobile-button" style="display:inline-block;background:${journal.primary};border-radius:8px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;padding:13px 20px;text-decoration:none;">View Published Articles</a>
          <p style="margin:22px 0 0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;">Best Regards,<br><strong>Editorial Office</strong><br>${journal.name}</p>
        </td>
      </tr>
    `,
  });

exports.createManuscriptRejectedEmail = ({
  authorName = "{{authorName}}",
  articleTitle = "{{articleTitle}}",
  reason = "",
  websiteUrl = journal.websiteUrl,
  logoCid,
} = {}) =>
  emailShell({
    logoCid,
    websiteUrl,
    headerTitle: "Manuscript Decision",
    preheader: "A decision has been made on your IJHAT manuscript submission.",
    children: `
      <tr>
        <td style="padding:32px 34px 8px;" class="email-padding">
          <div style="display:inline-block;background:#fff1f2;color:#be123c;border:1px solid #fecdd3;border-radius:999px;padding:8px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;">Not Accepted</div>
          <h2 style="margin:16px 0 12px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.35;">Manuscript Decision Notification</h2>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Dear ${escapeHtml(authorName)},</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Thank you for submitting your manuscript to ${journal.shortName}. After editorial consideration, we regret to inform you that the manuscript cannot be accepted for publication at this time.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 34px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #dfe8f2;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#f7fbff;padding:14px 16px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Decision Details</td>
            </tr>
            <tr>
              <td style="padding:0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
                  ${detailRow("Title", escapeHtml(articleTitle))}
                  ${detailRow("Status", '<span style="display:inline-block;background:#fff1f2;color:#be123c;border-radius:999px;padding:5px 10px;font-weight:700;">Rejected</span>')}
                  ${reason ? detailRow("Editorial Note", formatMultiline(reason)) : ""}
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">We appreciate the opportunity to review your work and encourage you to continue your research and scholarly publication efforts.</p>
        </td>
      </tr>
    `,
  });

exports.createPasswordResetEmail = ({
  resetUrl = "",
  otp = "",
  recipientLabel = "IJHAT account",
  expiry = "10 minutes",
  logoCid,
} = {}) =>
  emailShell({
    logoCid,
    headerTitle: "Password Reset",
    preheader: `Password reset instructions for your ${recipientLabel}.`,
    children: `
      <tr>
        <td style="padding:32px 34px;" class="email-padding">
          <div style="display:inline-block;background:#eef8ff;color:${journal.primary};border:1px solid #cfeeff;border-radius:999px;padding:8px 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;">Secure Request</div>
          <h2 style="margin:16px 0 12px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.35;">Reset Your Password</h2>
          <p style="margin:0 0 16px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">A password reset was requested for your ${escapeHtml(recipientLabel)}.</p>
          ${
            resetUrl
              ? `<a href="${resetUrl}" class="mobile-button" style="display:inline-block;background:${journal.primary};border-radius:8px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;padding:13px 20px;text-decoration:none;">Reset Password</a>`
              : `<div style="display:inline-block;background:#f7fbff;border:1px solid #dfe8f2;border-radius:10px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;letter-spacing:6px;padding:14px 18px;">${escapeHtml(otp)}</div>`
          }
          <p style="margin:20px 0 0;color:#64748b;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;">This reset request expires in ${escapeHtml(expiry)}. If you did not request it, you can safely ignore this email.</p>
        </td>
      </tr>
    `,
  });
