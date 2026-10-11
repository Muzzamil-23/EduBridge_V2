import authService from "../supabase/authService";

const API_URL = import.meta.env.VITE_API_URL;

const advisorService = {
  async sendMessage(message) {
    const {
      data: { session },
      error: sessionError,
    } = await authService.client.auth.getSession();

    if (sessionError) {
      throw new Error("Unable to verify your session. Please log in again.");
    }

    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch(`${API_URL}/advisor/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      throw new Error(
        data.detail || "Failed to get a response from the AI Advisor."
      );
    }

    return data.answer;
  },
};

export default advisorService;