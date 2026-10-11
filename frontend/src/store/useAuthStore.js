import { create } from "zustand";
import authService from "../supabase/authService";
import profileService from "../supabase/profileService";


const clearUserSpecificStorage = () => {
  const keysToClear = [
    "personalData",
    "academicData",
    "advisorChatHistory",
  ];

  keysToClear.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  isProfileCompleted: false,

  // --------------------------------------------------
  // Create new account
  // --------------------------------------------------

  createAccount: async ({ email, password }) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await authService.createAccount({
        email,
        password,
      });

      set({
        user: data.user || null,
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });

      throw err;
    }
  },

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  login: async ({ email, password }) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const data = await authService.login({
        email,
        password,
      });

      set({
        user: data.user || null,
      });

      await get().fetchUserProfile();

      set({
        loading: false,
      });

      return data;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });

      throw err;
    }
  },

  // --------------------------------------------------
  // Fetch current authenticated user
  // --------------------------------------------------

  fetchUser: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      // Get current Supabase user
      const user = await authService.getCurrentUser();

      if (user) {
        set({
          user,
        });

        await get().fetchUserProfile();
      } else {
        set({
          user: null,
          profile: null,
          isProfileCompleted: false,
        });
      }

      // Listen for authentication changes
      const {
        data: { subscription },
      } = authService.client.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            set({
              user: session.user,
            });

            await get().fetchUserProfile();
          } else {
            set({
              user: null,
              profile: null,
              isProfileCompleted: false,
            });
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (err) {
      console.error(
        "fetchUser error:",
        err.message
      );

      set({
        error: err.message,
        user: null,
        profile: null,
        isProfileCompleted: false,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // --------------------------------------------------
  // Fetch V2 profile
  // --------------------------------------------------
  //
  // Data comes from:
  // student_personal_data
  // student_academic_data
  //
  // --------------------------------------------------

  fetchUserProfile: async () => {
    const { user } = get();

    if (!user?.id) {
      set({
        profile: null,
        isProfileCompleted: false,
      });

      return null;
    }

    try {
      const [personal, academic] = await Promise.all([
        profileService.getPersonalData(user.id),
        profileService.getAcademicData(user.id),
      ]);

      const isComplete =
        Boolean(personal) && Boolean(academic);

      set({
        profile: {
          personal,
          academic,
        },
        isProfileCompleted: isComplete,
      });

      return {
        personal,
        academic,
      };
    } catch (err) {
      console.error(
        "Profile fetch error:",
        err.message
      );

      set({
        profile: null,
        isProfileCompleted: false,
        error: err.message,
      });

      return null;
    }
  },

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  logout: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      await authService.logout();
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });

      throw err;
    } finally {
      // Clear user-specific browser storage even if
      // the logout request fails.
      clearUserSpecificStorage();

      set({
        user: null,
        profile: null,
        isProfileCompleted: false,
        loading: false,
        error: null,
      });
    }
  },
}));