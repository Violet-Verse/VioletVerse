import { travelTable } from "./utils/travelTable";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, destination, dates, type, notes } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        await travelTable.create([
            {
                fields: {
                    Name: name,
                    Email: email,
                    Destination: destination || "",
                    "Travel Dates": dates || "",
                    "Experience Type": type || "",
                    Notes: notes || "",
                },
            },
        ]);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Airtable travel form error:", error);
        return res.status(500).json({ error: "Failed to submit form" });
    }
}
