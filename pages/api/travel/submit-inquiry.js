import { travelLeadsTable } from "../utils/travelLeadsTable";

export default async function submitInquiry(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, email, destination, travelDates, partySize, budget, specialRequests } = req.body;

    if (!name || !email || !destination || !travelDates) {
        return res.status(400).json({ error: "Name, email, destination, and travel dates are required." });
    }

    if (!travelLeadsTable) {
        return res.status(500).json({ error: "Travel leads table not configured." });
    }

    try {
        // Rate-limit: check for duplicate submission from same email in last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const existing = await travelLeadsTable
            .select({
                filterByFormula: `AND({Email} = "${email}", IS_AFTER({CreatedAt}, "${oneDayAgo}"))`,
                maxRecords: 1,
            })
            .firstPage();

        if (existing.length > 0) {
            return res.status(429).json({ error: "An inquiry from this email was already submitted recently. We'll be in touch soon!" });
        }

        // Create the lead record
        const records = await travelLeadsTable.create([
            {
                fields: {
                    Name: name,
                    Email: email,
                    Destination: destination,
                    "Travel Dates": travelDates,
                    "Party Size": partySize ? Number(partySize) : null,
                    Budget: budget ? Number(budget) : null,
                    "Special Requests": specialRequests || "",
                    Status: "New",
                    CreatedAt: new Date().toISOString(),
                },
            },
        ]);

        const recordId = records[0].id;

        // Fire-and-forget: trigger AI proposal generation asynchronously
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        fetch(`${baseUrl}/api/travel/generate-proposal`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recordId, name, email, destination, travelDates, partySize, budget, specialRequests }),
        }).catch((err) => console.error("generate-proposal fetch error:", err));

        return res.status(200).json({ success: true, recordId });
    } catch (err) {
        console.error("submit-inquiry error:", err);
        return res.status(500).json({ error: "Failed to submit inquiry." });
    }
}

export const config = {
    api: {
        externalResolver: true,
    },
};
