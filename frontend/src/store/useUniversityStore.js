import { create } from "zustand";
import universityService from "../supabase/univeristyService";

export const useUniversityStore = create((set) => ({
    universities: [],
    selectedUniversities: null,
    loading: false,
    scholarships: [],
    error: null,

    fetchUniversities: async () => {
        set({ loading: true, error: null })
        try {
            const data = await universityService.getAllUniversities()
            if (data) {
                set({ universities: data, loading: false })
            }
        } catch (error) {
            console.error("Error fetching universities:", error)
            set({ error: error.message, loading: false })
        }
    },

    fetchUniversityDetails: async (id) => {
        set({ loading: true, error: null })
        try {
            const data = await universityService.getUniversityWithPrograms(id)
            if (data) {
                set({ selectedUniversities: data, loading: false })
                return data
            }
        } catch (error) {
            console.error("Error fetching university details:", error)
            set({ error: error.message, loading: false })
        }
    },

    fetchScholarships: async () => {
        set({ loading: true, error: null });
        try {
            const data = await universityService.getAllScholarships();
            if (data) {
                set({ scholarships: data, loading: false });
            }
        } catch (error) {
            console.error("Error fetching scholarships:", error);
            set({ error: error.message, loading: false });
        }
    },

    clearSelectedUniversities: () => set({ selectedUniversities: null })
}))