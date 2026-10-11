// import Header from './Header';
// // import StatsCard from './StatsCard';
// import Recommendations from './Recommendations';
// import FeeInsights from './FeeInsights';
// import { useDashboardStore } from '../../store/useDashboardStore';
// import { useAuthStore } from '../../store/useAuthStore';
// import Scholarships from './Scholarship';
// import { useEffect } from 'react';

// const Dashboard = () => {
//   const { recommendations, fetchRecommendations } = useDashboardStore();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     fetchRecommendations();
//   }, [fetchRecommendations]);


//   return (
//     <div className="flex min-h-screen">
//       <main className="flex-1 p-6 overflow-y-auto">
//         <Header />
//         <div className="mt-14 grid grid-cols-1 xl:grid-cols-[7fr_3fr] gap-8">
//           {/* Recommendations */}
//           <section className="min-w-0 flex flex-col">
//             <div className="flex items-center gap-4 mb-5">
//               <img
//                 src="https://img.icons8.com/?size=100&id=63765&format=png&color=000000"
//                 alt="target-icon"
//                 className="w-10 h-10"
//               />
//               <h2 className="text-xl font-semibold">Your Top Matches</h2>
//             </div>
//             <div className="flex-1 flex flex-col">
//               <Recommendations />
//             </div>
//           </section>

//           {/* Fee Insights */}
//           <section className="min-w-0 flex flex-col">
//             <div className="flex items-center gap-4 mb-5">
//               <img
//                 src="https://img.icons8.com/?size=100&id=Nyz7uic92NRd&format=png&color=000000"
//                 alt="dollar-icon"
//                 className="w-10 h-10"
//               />
//               <h2 className="text-xl font-semibold">Fee Insights</h2>
//             </div>
//             <div className="flex-1 flex flex-col">
//               <FeeInsights programs={recommendations || []} />
//             </div>
//           </section>
//         </div>

//         {/* Scholarships */}
//         <div className="mt-12 mb-6">
//           <Scholarships />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;





import Header from "./Header";
import Recommendations from "./Recommendations";
import FeeInsights from "./FeeInsights";
import { useDashboardStore } from "../../store/useDashboardStore";
import Scholarships from "./Scholarship";
import { useEffect } from "react";
import Loader from "../Loader";

const Dashboard = () => {
  const {
    recommendations,
    loading,
    hasFetchedRecommendations,
    error,
    fetchRecommendations,
  } = useDashboardStore();

  useEffect(() => {
    fetchRecommendations().catch(() => {
      // The store records the error; avoid an unhandled promise rejection.
    });
  }, [fetchRecommendations]);

  // Don't render dashboard content before the first request finishes.
  if (loading || !hasFetchedRecommendations) {
    if (error && !loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-red-600 text-center">
            {typeof error === "string"
              ? error
              : "Failed to load recommendations."}
          </p>
          <button
            onClick={() =>
              fetchRecommendations().catch(() => {})
            }
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            Try Again
          </button>
        </div>
      );
    }

    return <Loader />;
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 overflow-y-auto">
        <Header />

        <div className="mt-14 grid grid-cols-1 xl:grid-cols-[7fr_3fr] gap-8">
          {/* Recommendations */}
          <section className="min-w-0 flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <img
                src="https://img.icons8.com/?size=100&id=63765&format=png&color=000000"
                alt="target-icon"
                className="w-10 h-10"
              />
              <h2 className="text-xl font-semibold">
                Your Top Matches
              </h2>
            </div>

            <div className="flex-1 flex flex-col">
              <Recommendations />
            </div>
          </section>

          {/* Fee Insights */}
          <section className="min-w-0 flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <img
                src="https://img.icons8.com/?size=100&id=Nyz7uic92NRd&format=png&color=000000"
                alt="dollar-icon"
                className="w-10 h-10"
              />
              <h2 className="text-xl font-semibold">
                Fee Insights
              </h2>
            </div>

            <div className="flex-1 flex flex-col">
              <FeeInsights programs={recommendations} />
            </div>
          </section>
        </div>

        {/* Scholarships */}
        <div className="mt-12 mb-6">
          <Scholarships />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
