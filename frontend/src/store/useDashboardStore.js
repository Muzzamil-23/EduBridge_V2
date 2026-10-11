// import { create } from "zustand";
// import axios from "axios";
// import { supabase } from "../supabase/config";

// const API_BASE = import.meta.env.VITE_API_URL;

// export const useDashboardStore = create((set, get) => ({
//   recommendations: [],
//   loading: false,
//   error: null,

//   stats: {
//     savedUniversities: 0,
//     totalSearches: 0,
//     recommendedCount: 0,
//   },

//   fetchRecommendations: async () => {
//     const { recommendations } = get();

//     // Use already loaded recommendations
//     if (recommendations.length > 0) {
//       console.log("⚡ Using cached recommendations from store");
//       return;
//     }

//     set({
//       loading: true,
//       error: null,
//     });

//     try {
//       // Get the current Supabase session
//       const {
//         data: { session },
//         error: sessionError,
//       } = await supabase.auth.getSession();

//       if (sessionError) {
//         throw sessionError;
//       }

//       if (!session?.access_token) {
//         throw new Error("User session not found.");
//       }

//       // Generate recommendations through the backend
//       const response = await axios.post(
//         `${API_BASE}/recommendations/generate`,
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.access_token}`,
//           },
//         }
//       );

//       const rawRecommendations =
//         response.data?.recommendations || [];

//       console.log(
//         "📦 Recommendation response from backend:",
//         response.data
//       );

//       // Convert backend recommendation shape
//       // into the shape expected by ExpandableCard
//       const recommendations = rawRecommendations.map(
//         (recommendation) => ({
//           ...recommendation,

//           id: recommendation.program_id,

//           program_name:
//             recommendation.programs?.program_name ||
//             "Unknown Program",

//           program_group:
//             recommendation.programs?.program_group || null,

//           university_name:
//             recommendation.programs?.universities?.university_name ||
//             null,

//           university: recommendation.programs?.universities || null,
//         })
//       );

//       console.log(
//         "📋 Recommendations stored:",
//         recommendations
//       );

//       set({
//         recommendations,
//         loading: false,
//         stats: {
//           ...get().stats,
//           recommendedCount: recommendations.length,
//         },
//       });

//       console.log(
//         `✅ Loaded ${recommendations.length} recommendations`
//       );
//     } catch (err) {
//       console.error(
//         "❌ Error fetching recommendations:",
//         err
//       );

//       set({
//         recommendations: [],
//         error:
//           err.response?.data?.detail ||
//           err.message ||
//           "Failed to generate recommendations.",
//         loading: false,
//       });
//     }
//   },

//   setStats: (stats) =>
//     set((state) => ({
//       stats: {
//         ...state.stats,
//         ...stats,
//       },
//     })),
// }));





import { create } from "zustand";
import axios from "axios";
import { supabase } from "../supabase/config";

const API_BASE = import.meta.env.VITE_API_URL;

let recommendationsRequest = null;

export const useDashboardStore = create((set, get) => ({
  recommendations: [],
  loading: false,
  hasFetchedRecommendations: false,
  error: null,

  stats: {
    savedUniversities: 0,
    totalSearches: 0,
    recommendedCount: 0,
  },

  fetchRecommendations: async () => {
    // Reuse successfully loaded data from Zustand.
    if (get().hasFetchedRecommendations) {
      return get().recommendations;
    }

    // Reuse an ongoing request instead of sending another one.
    if (recommendationsRequest) {
      return recommendationsRequest;
    }

    set({
      loading: true,
      error: null,
    });

    recommendationsRequest = (async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.access_token) {
          throw new Error("User session not found.");
        }

        const response = await axios.post(
          `${API_BASE}/recommendations/generate`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const rawRecommendations =
          response.data?.recommendations || [];

        const recommendations = rawRecommendations
          .filter(
            (rec) =>
              rec.program_id != null &&
              rec.programs?.program_name &&
              rec.programs?.universities?.university_name
          )
          .map((rec) => ({
            ...rec,
            id: rec.program_id,
            program_name: rec.programs.program_name,
            program_group: rec.programs.program_group || null,
            university_name:
              rec.programs.universities.university_name,
            university: rec.programs.universities,
          }));

        set({
          recommendations,
          hasFetchedRecommendations: true,
          error: null,
          stats: {
            ...get().stats,
            recommendedCount: recommendations.length,
          },
        });

        console.log(
          `Loaded ${recommendations.length} recommendations`
        );

        return recommendations;
      } catch (err) {
        console.error("Error fetching recommendations:", err);

        set({
          error:
            err.response?.data?.detail ||
            err.message ||
            "Failed to generate recommendations.",
          hasFetchedRecommendations: false,
        });

        throw err;
      } finally {
        set({ loading: false });
        recommendationsRequest = null;
      }
    })();

    return recommendationsRequest;
  },

  setStats: (stats) =>
    set((state) => ({
      stats: {
        ...state.stats,
        ...stats,
      },
    })),
}));


