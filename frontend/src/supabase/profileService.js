import { supabase } from "./config";

export class ProfileService {
  constructor() {
    this.client = supabase;
  }

  // --------------------------------------------------
  // Get currently authenticated user
  // --------------------------------------------------

  async getCurrentUser() {
    const {
      data: { session },
      error,
    } = await this.client.auth.getSession();

    if (error) {
      throw new Error(`Failed to retrieve user session: ${error.message}`);
    }

    if (!session?.user?.id) {
      throw new Error("No active user session found.");
    }

    return session.user;
  }

  // --------------------------------------------------
  // Check if user completed both sections
  // --------------------------------------------------

  async isProfileCompleted(userId) {
    if (!userId) return false;

    try {
      const [personalResult, academicResult] = await Promise.all([
        this.client
          .from("student_personal_data")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle(),

        this.client
          .from("student_academic_data")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle(),
      ]);

      if (personalResult.error) {
        throw new Error(
          `Failed to check personal profile: ${personalResult.error.message}`
        );
      }

      if (academicResult.error) {
        throw new Error(
          `Failed to check academic profile: ${academicResult.error.message}`
        );
      }

      return Boolean(
        personalResult.data && academicResult.data
      );
    } catch (error) {
      console.error(
        "Error checking profile completion:",
        error
      );

      return false;
    }
  }

  // --------------------------------------------------
  // Fetch personal data
  // --------------------------------------------------

  async getPersonalData(userId) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const { data, error } = await this.client
      .from("student_personal_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to fetch personal data: ${error.message}`
      );
    }

    return data;
  }

  // --------------------------------------------------
  // Fetch academic data
  // --------------------------------------------------

  async getAcademicData(userId) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const { data, error } = await this.client
      .from("student_academic_data")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to fetch academic data: ${error.message}`
      );
    }

    return data;
  }

  // --------------------------------------------------
  // Upsert personal data
  // --------------------------------------------------

  async upsertPersonalData(payload) {
    const user = await this.getCurrentUser();

    const personalData = {
      user_id: user.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      age: payload.age === "" ? null : Number(payload.age),
    };

    const { data, error } = await this.client
      .from("student_personal_data")
      .upsert(personalData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to save personal data: ${error.message}`
      );
    }

    return data;
  }

  // --------------------------------------------------
  // Upsert academic data
  // --------------------------------------------------

  async upsertAcademicData(payload) {
    const user = await this.getCurrentUser();

    const academicData = {
      user_id: user.id,
      preferred_university_type:
        payload.preferred_university_type,
      preferred_program_group:
        payload.preferred_program_group,
      per_semester_budget:
        payload.per_semester_budget === ""
          ? null
          : Number(payload.per_semester_budget),
      scholarship_requirement:
        payload.scholarship_requirement ?? false,
      hostel_requirement:
        payload.hostel_requirement ?? false,
      transport_requirement:
        payload.transport_requirement ?? false,
      specific_universities:
        payload.specific_universities || null,
      entry_test_requirement:
        payload.entry_test_requirement ?? false,
      academic_percentage:
        payload.academic_percentage === ""
          ? null
          : Number(payload.academic_percentage),
    };

    const { data, error } = await this.client
      .from("student_academic_data")
      .upsert(academicData, {
        onConflict: "user_id",
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to save academic data: ${error.message}`
      );
    }

    return data;
  }
}

const profileService = new ProfileService();

export default profileService;
