import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useDashboardStore } from "../store/useDashboardStore";
import Loader from "../components/Loader";
import RecommendationCard from "../components/RecommendationCard"; // hypothetical

const StudentDashboard = () => {
  const { user, isProfileCompleted } = useAuthStore();
  const { recommendations, fetchRecommendations, loading, error } = useDashboardStore();

  // fetch recommendations only if profile is completed
  useEffect(() => {
    if (user?.id && isProfileCompleted) {
      fetchRecommendations(user.id);
    }
  }, [user, isProfileCompleted, fetchRecommendations]);

  if (!isProfileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Complete your profile to see recommendations.</p>
      </div>
    );
  }

  if (loading) return <Loader />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recommended Universities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <RecommendationCard key={rec.uni_id + rec.program_id} rec={rec} />
          ))
        ) : (
          <p>No recommendations available yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
