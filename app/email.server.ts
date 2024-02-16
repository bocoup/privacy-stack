import sgMail from "@sendgrid/mail";

export function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  const msg = {
    from: "boaz@bocoup.com",
    to,
    subject,
    text,
    html,
  };
  sgMail.send(msg).catch((error) => {
    console.error(error);
  });
}
