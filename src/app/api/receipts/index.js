import { fetchReceipts, createRecipe } from "@/app/services/receiptService";

export default async function handler(req, res) {
    const { method } = req;

    try {
        if (method === "GET") {
            const { userId } = req.query;
            const receipts = await fetchReceipts(userId);
            return res.status(200).json(receipts);
        }

        if (method === "POST") {
            const receipt = req.body;
            const id = await createRecipe(receipt);
            return res.status(201).json({ id });
        }

        return res.status(405).json({ message: "Method Not Allowed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
