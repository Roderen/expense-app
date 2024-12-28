import { deleteReceipt } from "@/app/services/receiptService";

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    try {
        if (method === "DELETE") {
            await deleteReceipt(id);
            return res.status(204).end();
        }

        return res.status(405).json({ message: "Method Not Allowed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
