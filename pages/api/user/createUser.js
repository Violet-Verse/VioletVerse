import { table } from "../utils/Airtable";

export default async function todos(req, res) {
    const { userId, email, role, bio, flowAddress } = req.body;
    try {
        const createdRecords = await table.create([
            { fields: { userId, email, role, bio, flowAddress } },
        ]);
        const createdRecord = {
            id: createdRecords[0].id,
            fields: createdRecords[0].fields,
        };
        res.status(200);
        res.json(createdRecord);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.json({ msg: "Something went wrong" });
    }
}
