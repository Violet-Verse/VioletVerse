import { travelLeadsTable, minifyRecords } from "../utils/travelLeadsTable";

export default async function pollLeads(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    // Protect with a shared secret so this can only be called by your cron job
    const secret = req.headers["x-webhook-secret"];
    if (!secret || secret !== process.env.TRAVEL_POLL_SECRET) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    if (!travelLeadsTable) {
        return res.status(500).json({ error: "Travel leads table not configured." });
    }

    try {
        // Find all New leads that haven't received a proposal yet
        const records = await travelLeadsTable
            .select({
                filterByFormula: `AND({Status} = "New", {ProposalText} = "")`,
                maxRecords: 20,
            })
            .firstPage();

        if (records.length === 0) {
            return res.status(200).json({ processed: 0, message: "No new leads." });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        let processed = 0;

        for (const record of records) {
            const fields = record.fields;
            try {
                await fetch(`${baseUrl}/api/travel/generate-proposal`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        recordId: record.id,
                        name: fields.Name,
                        email: fields.Email,
                        destination: fields.Destination,
                        travelDates: fields.TravelDates,
                        partySize: fields.PartySize,
                        budget: fields.Budget,
                        specialRequests: fields.SpecialRequests,
                    }),
                });
                processed++;
            } catch (err) {
                console.error(`Failed to process lead ${record.id}:`, err);
            }
        }

        return res.status(200).json({ processed, total: records.length });
    } catch (err) {
        console.error("poll-leads error:", err);
        return res.status(500).json({ error: "Failed to poll leads." });
    }
}
