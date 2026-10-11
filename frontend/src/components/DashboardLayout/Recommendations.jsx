import React from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import ExpandableCard from "../ExpandableCard";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Recommendations = ({ limit = 4 }) => {
  const { recommendations } = useDashboardStore();
  const navigate = useNavigate();

  const previewRecommendations = recommendations?.slice(0, limit) || [];

  return (
    <div className="flex-1 flex flex-col bg-[#daf6c0] p-6 pt-3 rounded-2xl">
      {recommendations?.length > limit && (
        <div className="flex justify-end mb-2">
          <button
            className="group flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/student-dashboard/recommendations")}
          >
            <span>See All</span>
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </button>
        </div>
      )}

      {previewRecommendations.length > 0 ? (
        <ExpandableCard programs={previewRecommendations} />
      ) : (
        <p className="text-gray-500">No recommendations yet.</p>
      )}
    </div>
  );
};

export default Recommendations;