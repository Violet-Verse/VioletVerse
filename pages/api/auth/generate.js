import crypto from "crypto";
import { addNonce } from "../aws/nonceControl";

export default function handler(req, res) {
    const nonce = crypto.randomBytes(32).toString("hex");
    addNonce(nonce);
    console.log("Nonce Added to DB");
    res.status(200).json({ nonce });
}
