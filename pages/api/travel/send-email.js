import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildEmailHtml({ name, destination, proposal }) {
    const firstName = name.split(" ")[0];

    const hotelOptionsHtml = proposal.hotelOptions
        .map(
            (hotel, i) => `
        <div style="background:#f9f7ff;border-left:4px solid #7c3aed;padding:16px;margin-bottom:16px;border-radius:4px;">
            <h3 style="margin:0 0 8px;color:#4c1d95;">Option ${i + 1}: ${hotel.name}</h3>
            <p style="margin:0 0 6px;color:#374151;">${hotel.description}</p>
            <p style="margin:0 0 4px;"><strong>Estimated Rate:</strong> <span style="color:#7c3aed;">${hotel.estimatedNightlyRate}</span></p>
            <p style="margin:0;font-style:italic;color:#6b7280;">${hotel.whyItFits}</p>
        </div>`
        )
        .join("");

    const itineraryHtml = proposal.itineraryHighlights
        .map((day) => `<li style="margin-bottom:8px;color:#374151;">${day}</li>`)
        .join("");

    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;background:#fff;">

  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #7c3aed;margin-bottom:32px;">
    <h1 style="margin:0;color:#4c1d95;font-size:28px;letter-spacing:1px;">VioletVerse Travel</h1>
    <p style="margin:8px 0 0;color:#7c3aed;font-size:14px;">Your Personal Travel Agent</p>
  </div>

  <p style="font-size:18px;line-height:1.6;">${proposal.greeting}</p>
  <p style="line-height:1.7;color:#374151;">${proposal.intro}</p>

  <h2 style="color:#4c1d95;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Your ${destination} Hotel Options</h2>
  ${hotelOptionsHtml}

  <h2 style="color:#4c1d95;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Sample Itinerary Highlights</h2>
  <ul style="padding-left:20px;line-height:1.8;">
    ${itineraryHtml}
  </ul>

  <div style="background:#4c1d95;color:#fff;padding:20px;border-radius:8px;margin:24px 0;text-align:center;">
    <p style="margin:0;font-size:20px;font-weight:bold;">Estimated Trip Total</p>
    <p style="margin:8px 0 0;font-size:28px;color:#c4b5fd;">${proposal.estimatedTotalRange}</p>
    <p style="margin:8px 0 0;font-size:13px;opacity:0.8;">for your group · based on your dates & party size</p>
  </div>

  <h2 style="color:#4c1d95;border-bottom:1px solid #e5e7eb;padding-bottom:8px;">Next Steps</h2>
  <p style="line-height:1.7;color:#374151;">${proposal.nextSteps}</p>

  <div style="background:#fef3c7;border:1px solid #f59e0b;padding:16px;border-radius:6px;margin:24px 0;">
    <p style="margin:0;font-weight:bold;color:#92400e;">📎 Credit Card Authorization Form Attached</p>
    <p style="margin:8px 0 0;color:#78350f;font-size:14px;">
      Please complete, sign, and reply with the attached CC Authorization Form to confirm your booking.
      This form protects both of us during the travel booking process.
    </p>
  </div>

  <p style="line-height:1.7;color:#374151;">${proposal.closing}</p>

  <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:16px;">
    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
      ${proposal.agentDisclosure}<br>
      VioletVerse Travel · violetverse.io/travel · Reply to this email to reach your agent
    </p>
  </div>

</body>
</html>`;
}

export default async function sendEmail(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, email, destination, proposal } = req.body;

    if (!name || !email || !destination || !proposal) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Attach CC auth PDF if it exists
    const attachments = [];
    const pdfPath = path.join(process.cwd(), "public", "travel", "cc-auth-form.pdf");
    if (fs.existsSync(pdfPath)) {
        const pdfData = fs.readFileSync(pdfPath).toString("base64");
        attachments.push({
            filename: "CC-Authorization-Form.pdf",
            content: pdfData,
        });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "VioletVerse Travel <travel@violetverse.io>",
            to: [email],
            subject: `Your ${destination} Trip Proposal is Ready! ✈️`,
            html: buildEmailHtml({ name, destination, proposal }),
            attachments,
        });

        if (error) {
            console.error("Resend error:", error);
            return res.status(500).json({ error: "Failed to send email." });
        }

        return res.status(200).json({ success: true, emailId: data?.id });
    } catch (err) {
        console.error("send-email error:", err);
        return res.status(500).json({ error: "Failed to send email." });
    }
}

export const config = {
    api: {
        externalResolver: true,
    },
};
