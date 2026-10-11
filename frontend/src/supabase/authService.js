import { supabase } from "./config";
export class AuthService {
    client
    constructor() {
        this.client = supabase
    }

    // Signup
    async createAccount({ email, password }) {
        try {
            let { data, error } = await this.client.auth.signUp({ email, password })
            if (error) throw error
            return data
        } catch (error) {
            console.error("AuthService :: createAccount :: error", error.message);
            throw error
        }
    }

    // login
    async login({ email, password }) {
        try {
            let { data, error } = await this.client.auth.signInWithPassword({ email, password })
            if (error) throw error
            return data
        } catch (error) {
            console.error("AuthService :: login :: error", error.message);
            throw error
        }
    }

    // get current user session safely
    async getCurrentUser() {
        try {
            // 1️⃣ Check if session exists
            const { data: { session }, error } = await this.client.auth.getSession();
            if (error) throw error;

            // 2️⃣ If no session → no logged-in user
            if (!session) return null;

            // 3️⃣ If session exists, fetch the user
            const { data: { user }, error: userError } = await this.client.auth.getUser();
            if (userError) throw userError;

            return user || null;
        } catch (err) {
            console.error("AuthService :: getCurrentUser :: error", err.message);
            return null;
        }
    }


    async logout() {
        try {
            const { error } = await this.client.auth.signOut()
            if (error) throw error
            return true
        } catch (error) {
            console.error("AuthService :: getCurrentUser :: error", error.message);
            throw error
        }
    }



}

const authService = new AuthService()

export default authService
