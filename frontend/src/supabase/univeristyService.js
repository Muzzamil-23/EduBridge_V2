import { supabase } from "./config";

export class UniversityService {
    client;

    constructor() {
        this.client = supabase;
    }

    async getAllUniversities() {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/universities`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch universities.");
            }

            const data = await response.json();

            return data.universities || [];
        } catch (error) {
            console.error(
                "UniversityService :: getAllUniversities :: error",
                error.message
            );

            throw error;
        }
    }

    async getUniversityWithPrograms(id) {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/universities/${id}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch university details.");
            }

            const data = await response.json();

            return data.university || null;
        } catch (error) {
            console.error(
                "UniversityService :: getUniversityWithPrograms :: error",
                error.message
            );

            throw error;
        }
    }

    async getAllScholarships() {
        const { data, error } = await this.client
            .from("scholarships")
            .select("*")
            .eq("active", true)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    }
}

const universityService = new UniversityService();

export default universityService;