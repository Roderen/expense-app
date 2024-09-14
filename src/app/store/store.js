import {create} from "zustand";

export const useReceiptsStore = create((set) => ({
    // searchTerm: "",
    // setSearchTerm: (term) => set({searchTerm: term}),
    receipts: [],
    setReceipts: (receipts) => set({receipts}),
}))