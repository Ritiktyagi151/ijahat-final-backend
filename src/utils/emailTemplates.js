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
  shortName: "IJAHT",
  tagline: "Peer-reviewed open access journal for healthcare and technology research",
  websiteUrl: "https://ijaht.com/",
  email: "journal@ijaht.com",
  primary: "#0056b3",
  secondary: "#0d9ecf",
};

const getFrontendUrl = () => (process.env.FRONTEND_URL || "https://ijaht.com/").replace(/\/?$/, "/");
const renderBrandBlock = (align = "left") => `
  <div style="font-family:Arial,Helvetica,sans-serif;text-align:${align};">
    <div style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.15;font-weight:800;letter-spacing:.8px;">IJAHT</div>
    <div style="margin-top:6px;color:#e8f7ff;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.45;font-weight:600;">International Journal of Applied Healthcare and Technology</div>
  </div>
`;

const humanizeLabel = (key = "") =>
  String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getValue = (data, keys, defaultValue = "") => {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
  }

  return defaultValue;
};

const excludedAdminKeys = new Set([
  "name",
  "firstName",
  "lastName",
  "fullName",
  "authorName",
  "email",
  "phone",
  "country",
  "institution",
  "date",
  "submissionDate",
  "submittedAt",
  "submissionId",
  "_id",
  "id",
  "articleTitle",
  "manuscriptTitle",
  "manuscriptFile",
  "uploadedFileName",
  "fileName",
  "status",
  "currentStatus",
  "ipAddress",
  "viewUrl",
]);

const normalizeTemplateData = (data = {}) => {
  const fullName =
    getValue(data, ["fullName", "name", "authorName"]) ||
    `${getValue(data, ["firstName"])} ${getValue(data, ["lastName"])}`.trim();
  const submissionDate =
    getValue(data, ["submissionDate", "date", "submittedAt"]) ||
    new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

  return {
    ...data,
    fullName: fullName || "Valued Researcher",
    firstName: getValue(data, ["firstName"]) || String(fullName || "Valued Researcher").split(" ")[0],
    email: getValue(data, ["email"]),
    phone: getValue(data, ["phone"]),
    country: getValue(data, ["country"]),
    institution: getValue(data, ["institution", "organization", "affiliation"]),
    submissionDate,
    frontendUrl: getFrontendUrl(),
  };
};

const renderAdminRows = (data = {}) => {
  const normalized = normalizeTemplateData(data);
  const highlightedRows = [
    ["Name", normalized.fullName],
    ["Email", normalized.email],
    ["Phone", normalized.phone],
    ["Country", normalized.country],
    ["Institution", normalized.institution],
    ["Submission Date", normalized.submissionDate],
  ];
  const additionalRows = Object.entries(data)
    .filter(([key, value]) => !excludedAdminKeys.has(key) && value !== undefined && value !== null && value !== "")
    .map(([key, value]) => [humanizeLabel(key), value]);

  return [...highlightedRows, ...additionalRows]
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:13px 16px;border-bottom:1px solid #e6edf5;background:#f8fbff;color:#486176;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:13px 16px;border-bottom:1px solid #e6edf5;color:#152536;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;vertical-align:top;">${formatMultiline(value)}</td>
        </tr>
      `,
    )
    .join("");
};

exports.getUserThankYouTemplate = (data = {}) => {
  const details = normalizeTemplateData(data);
  const isManuscript = Boolean(getValue(details, ["articleTitle", "manuscriptTitle", "manuscriptFile"]));
  const submissionId = escapeHtml(getValue(details, ["submissionId", "_id", "id"], "Pending assignment"));
  const manuscriptTitle = escapeHtml(getValue(details, ["articleTitle", "manuscriptTitle", "subject"], "Your manuscript"));
  const subject = escapeHtml(getValue(details, ["subject", "articleTitle"], "Your submission"));
  const currentStatus = escapeHtml(getValue(details, ["currentStatus", "status"], "Received"));
  const summaryRows = isManuscript
    ? `
                      <strong>Author Name:</strong> ${escapeHtml(details.fullName)}<br>
                      <strong>Submission ID:</strong> ${submissionId}<br>
                      <strong>Manuscript Title:</strong> ${manuscriptTitle}<br>
                      <strong>Submission Date:</strong> ${escapeHtml(details.submissionDate)}<br>
                      <strong>Current Status:</strong> ${currentStatus}
                    `
    : `
                      <strong>Name:</strong> ${escapeHtml(details.fullName)}<br>
                      <strong>Email:</strong> ${escapeHtml(details.email)}<br>
                      <strong>Subject:</strong> ${subject}<br>
                      <strong>Date:</strong> ${escapeHtml(details.submissionDate)}
                    `;

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thank You For Your Submission</title>
    <style>
      @media only screen and (max-width: 640px) {
        .container { width: 100% !important; }
        .px { padding-left: 20px !important; padding-right: 20px !important; }
        .button { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#eef4f8;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your submission has been received by IJAHT.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef4f8;">
      <tr>
        <td align="center" style="padding:30px 12px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" class="container" style="width:640px;max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 46px rgba(18,38,63,0.14);">
            <tr>
              <td class="px" style="padding:30px 34px;background:#0b4f7a;">
                ${renderBrandBlock()}
                <h1 style="margin:18px 0 6px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:25px;line-height:1.25;">Thank You For Your Submission</h1>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:32px 34px 8px;">
                <div style="background:#eaf8f0;border:1px solid #bfe8ce;border-radius:14px;padding:16px 18px;color:#13733a;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Submission received successfully</div>
                <p style="margin:24px 0 14px;color:#23384d;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.75;">Dear ${escapeHtml(details.firstName)},</p>
                <p style="margin:0 0 14px;color:#40566b;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">${
                  isManuscript
                    ? `Thank you for submitting your manuscript to ${journal.name}. This email confirms that your submission has been received by the editorial office.`
                    : `Thank you for submitting your information to ${journal.shortName}. This email confirms that your submission has been received successfully.`
                }</p>
                <p style="margin:0;color:#40566b;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">${
                  isManuscript
                    ? "Our team will complete the initial checks and contact you if any additional information is required. Please keep this confirmation for your records."
                    : "Our editorial team will review the details and respond as appropriate. Please keep this confirmation for your records."
                }</p>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:20px 34px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #dbe7f0;border-radius:14px;overflow:hidden;">
                  <tr>
                    <td style="padding:15px 18px;background:#f7fbff;color:#0b4f7a;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">Submission Summary</td>
                  </tr>
                  <tr>
                    <td style="padding:16px 18px;color:#40566b;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.75;">
                      ${summaryRows}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:6px 34px 34px;">
                <a href="${details.frontendUrl}" class="button" style="display:inline-block;background:#0b75b7;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:9px;padding:13px 22px;text-align:center;">Visit IJAHT Website</a>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:24px 34px;background:#f7fbff;border-top:1px solid #e2edf5;text-align:center;">
                <p style="margin:0 0 8px;color:#50677d;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;">Editorial Office, ${journal.name}</p>
                <p style="margin:0;color:#7c8b99;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;"><a href="https://ijaht.com" style="color:#0b75b7;text-decoration:none;font-weight:700;">Visit Website</a> &nbsp;|&nbsp; <a href="mailto:journal@ijaht.com" style="color:#0b75b7;text-decoration:none;font-weight:700;">journal@ijaht.com</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

exports.getAdminNotificationTemplate = (data = {}) => {
  const details = normalizeTemplateData(data);
  const isManuscript = Boolean(getValue(details, ["articleTitle", "manuscriptTitle", "manuscriptFile"]));
  const submissionId = escapeHtml(getValue(details, ["submissionId", "_id", "id"], "Pending assignment"));
  const manuscriptTitle = escapeHtml(getValue(details, ["articleTitle", "manuscriptTitle", "subject"], "Not provided"));
  const uploadedFileName = escapeHtml(getValue(details, ["manuscriptFile", "uploadedFileName", "fileName"], "Not provided"));
  const adminRows = isManuscript
    ? `
                  ${detailRow("Author Name", escapeHtml(details.fullName))}
                  ${detailRow("Author Email", `<a href="mailto:${escapeHtml(details.email)}" style="color:#0056b3;font-weight:700;text-decoration:none;">${escapeHtml(details.email)}</a>`)}
                  ${detailRow("Submission ID", submissionId)}
                  ${detailRow("Manuscript Title", manuscriptTitle)}
                  ${detailRow("Submission Date", escapeHtml(details.submissionDate))}
                  ${detailRow("Uploaded File Name", uploadedFileName)}
                  ${renderAdminRows(data)}
                `
    : renderAdminRows(data);

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Submission Received</title>
    <style>
      @media only screen and (max-width: 640px) {
        .container { width: 100% !important; }
        .px { padding-left: 18px !important; padding-right: 18px !important; }
        .stack { display:block !important;width:100% !important;text-align:left !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#edf2f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#edf2f7;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="720" cellspacing="0" cellpadding="0" border="0" class="container" style="width:720px;max-width:720px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 16px 42px rgba(15,35,65,0.13);">
            <tr>
              <td class="px" style="padding:24px 30px;background:#12344d;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="stack" style="vertical-align:middle;">
                      ${renderBrandBlock()}
                      <div style="color:#aee0f5;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Admin Notification</div>
                      <h1 style="margin:6px 0 0;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.3;">New Submission Received</h1>
                    </td>
                    <td class="stack" align="right" style="vertical-align:middle;color:#cfe9f5;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;">${escapeHtml(details.submissionDate)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:28px 30px 14px;">
                <div style="background:#f1f8fc;border:1px solid #cde7f4;border-radius:12px;padding:15px 17px;color:#164d6d;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;">${
                  isManuscript
                    ? "A new manuscript submission has arrived from the IJAHT website. Review the author and manuscript details below."
                    : "A new form submission has arrived from the IJAHT website. Review the submitted information below."
                }</div>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:12px 30px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border-spacing:0;border:1px solid #d8e4ee;border-radius:12px;overflow:hidden;">
                  <tr>
                    <td colspan="2" style="padding:15px 16px;background:#0b75b7;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">${isManuscript ? "Manuscript Submission Details" : "Submitted Form Data"}</td>
                  </tr>
                  ${adminRows}
                </table>
              </td>
            </tr>
            <tr>
              <td class="px" style="padding:20px 30px;background:#f8fbfd;border-top:1px solid #e2edf5;color:#738292;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;text-align:center;"><a href="https://ijaht.com" style="color:#0b75b7;text-decoration:none;font-weight:700;">Visit Website</a> &nbsp;|&nbsp; <a href="mailto:journal@ijaht.com" style="color:#0b75b7;text-decoration:none;font-weight:700;">journal@ijaht.com</a><br>Automated email from ${journal.shortName}. Do not share this message outside the editorial workflow.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
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

const emailShell = ({ preheader, headerTitle, children, websiteUrl = journal.websiteUrl }) => `
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
                    <td style="vertical-align:middle;">
                      ${renderBrandBlock()}
                      <h1 style="margin:18px 0 4px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.28;font-weight:700;">${escapeHtml(headerTitle)}</h1>
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
  websiteUrl = journal.websiteUrl,
} = {}) => {
  const safeFirstName = escapeHtml(fallback(firstName, "{{firstName}}"));
  const safeFullName = escapeHtml(fallback(fullName, "{{fullName}}"));
  const safeEmail = escapeHtml(fallback(email, "{{email}}"));
  const safeSubject = escapeHtml(fallback(subject, "{{subject}}"));

  return emailShell({
    websiteUrl,
    headerTitle: "Thank You for Contacting IJAHT",
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
          <h2 style="margin:0 0 14px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.35;font-weight:700;">Thank You for Contacting IJAHT</h2>
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
                <a href="${websiteUrl}" class="mobile-button" style="display:inline-block;padding:13px 22px;color:#ffffff;background:${journal.primary};border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">Visit IJAHT Website</a>
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
    websiteUrl,
    headerTitle: "New Form Submission Received",
    preheader: "A new IJAHT form submission is waiting for review.",
    children: `
      <tr>
        <td style="padding:30px 34px 12px;" class="email-padding">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
            <tr>
              <td class="stack-column" style="vertical-align:middle;">
                <div style="display:inline-block;background:#e9f7fc;color:${journal.secondary};border:1px solid #ccecf6;border-radius:999px;padding:7px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;">New Inquiry</div>
                <h2 style="margin:14px 0 5px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.32;font-weight:700;">New Submission Notification</h2>
                <p style="margin:0;color:#637487;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;">A new form submission has arrived from the IJAHT website.</p>
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
          <p style="margin:18px 0 0;color:#68798b;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.65;">This is an automated admin notification from the IJAHT website forms system.</p>
        </td>
      </tr>
    `,
  });
};

exports.createNewsletterSubscriberEmail = ({ email = "{{email}}" } = {}) =>
  emailShell({
    headerTitle: "Newsletter Subscription Successful",
    preheader: "Your IJAHT newsletter subscription is active.",
    children: `
      <tr>
        <td style="padding:32px 34px;" class="email-padding">
          <div style="background:#eef8ff;border:1px solid #cfeeff;border-radius:12px;padding:16px 18px;margin-bottom:22px;color:${journal.primary};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;">
            Subscription successful
          </div>
          <h2 style="margin:0 0 14px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1.35;">Thank you for subscribing to IJAHT</h2>
          <p style="margin:0 0 14px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">Your email address <strong>${escapeHtml(email)}</strong> has been successfully added to the IJAHT newsletter.</p>
          <p style="margin:0;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;">You will receive journal updates, new issue alerts, announcements, publication news, and important author resources from the editorial office.</p>
        </td>
      </tr>
    `,
  });

exports.createNewsletterAdminEmail = ({
  email = "{{email}}",
  date = "{{date}}",
  source = "IJAHT Website",
} = {}) =>
  emailShell({
    headerTitle: "New Newsletter Subscriber",
    preheader: "A new visitor subscribed to the IJAHT newsletter.",
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
} = {}) =>
  emailShell({
    headerTitle: "Manuscript Accepted",
    preheader: "Your IJAHT manuscript has been accepted for publication.",
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
} = {}) =>
  emailShell({
    websiteUrl,
    headerTitle: "Manuscript Decision",
    preheader: "A decision has been made on your IJAHT manuscript submission.",
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
  recipientLabel = "IJAHT account",
  expiry = "10 minutes",
} = {}) =>
  emailShell({
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
              ? `<a href="${escapeHtml(resetUrl)}" class="mobile-button" style="display:inline-block;background:${journal.primary};border-radius:8px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;padding:14px 22px;text-decoration:none;">Reset Password</a>
          <p style="margin:20px 0 8px;color:#34495e;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;">If the button does not work, copy and paste this reset link into your browser:</p>
          <p style="margin:0;word-break:break-all;color:#0056b3;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.65;"><a href="${escapeHtml(resetUrl)}" style="color:#0056b3;text-decoration:underline;">${escapeHtml(resetUrl)}</a></p>`
              : `<div style="display:inline-block;background:#f7fbff;border:1px solid #dfe8f2;border-radius:10px;color:#0f2f55;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:800;letter-spacing:6px;padding:14px 18px;">${escapeHtml(otp)}</div>`
          }
          <p style="margin:20px 0 0;color:#64748b;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;">This reset request expires in ${escapeHtml(expiry)}. If you did not request it, you can safely ignore this email.</p>
        </td>
      </tr>
    `,
  });
