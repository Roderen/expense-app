import {addDoc, collection, deleteDoc, query, doc, where, getDocs} from "firebase/firestore";
import {firestore} from "@/app/firebase/config";

const receiptsCollection = collection(firestore, "receipts");

export const fetchReceipts = async (userId) => {
    let snapshot = await getDocs(receiptsCollection);
    snapshot = snapshot.docs.map(val => ({...val.data(), key: val.id}));
    return snapshot.filter(doc => doc.userId === userId);
}

export const createRecipe = async (e) => {
    const valRef = collection(firestore, "receipts");

    try {
        await addDoc(valRef, e);
    } catch (err) {
        console.log(err);
    }
}

export const deleteReceipt = async (receiptId) => {
    try {
        const receiptsRef = collection(firestore, "receipts");
        // Searching collection post which have a receiptId
        const q = query(receiptsRef, where("id", "==", receiptId));

        // If collection have post which contain receiptId then we'll get this goc
        const querySnapshot = await getDocs(q);

        // We have one post with a unique id, so we don't need use forEach loop, just [0] to get single doc
        const docSnapshot = querySnapshot.docs[0];
        await deleteDoc(doc(firestore, "receipts", docSnapshot.id));
    } catch (err) {
        console.error("Error deleting receipt: ", err);
    }
}