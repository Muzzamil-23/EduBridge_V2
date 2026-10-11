import React from "react";
import { useDashboardStore } from "../../store/useDashboardStore";
import ExpandableCard from "../ExpandableCard";

const AllRecommendations = () => {
  const { recommendations } = useDashboardStore();

  const allRecommendations =
    recommendations?.map((rec) => ({
      ...rec,

      id: rec.program_id,

      program_name:
        rec.programs?.program_name ||
        "Unknown Program",

      program_group:
        rec.programs?.program_group ||
        null,

      university_name:
        rec.programs?.universities?.university_name ||
        "Unknown University",

      university:
        rec.programs?.universities ||
        null,
    })) || [];

  return (
    <section className="p-6 bg-[#DAF6C0] rounded-2xl mt-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://img.icons8.com/?size=100&id=p3miLroKw4iR&format=png&color=000000"
          alt="search-icon"
          className="w-10 h-10"
        />

        <h2 className="text-2xl font-bold">
          All Recommended Programs
        </h2>
      </div>

      {allRecommendations.length > 0 ? (
        <ExpandableCard
          programs={allRecommendations}
          showMatchingScore={false}
        />
      ) : (
        <p className="text-gray-500">
          No recommendations available.
        </p>
      )}
    </section>
  );
};

export default AllRecommendations;