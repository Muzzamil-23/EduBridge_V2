import { useEffect } from "react";
import { useUniversityStore } from "../../store/useUniversityStore";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Scholarships = () => {
  const { scholarships, fetchScholarships, loading } = useUniversityStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const displayedScholarships = scholarships.slice(0, 4);

  return (
    <div className="mt-12 mb-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://img.icons8.com/?size=100&id=fKJgvKmH6NsF&format=png&color=000000"
            alt="scholarship-icon"
            className="w-10 h-10"
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Available Scholarships
          </h2>
        </div>

        {/* See All Button */}
        <button
          className="group flex items-center gap-1 cursor-pointer text-gray-600 hover:text-gray-800 font-medium"
          onClick={() => navigate("/student-dashboard/scholarships")}
        >
          <span>See All</span>
          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-2"
          />
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-500">Loading scholarships...</p>
      ) : displayedScholarships.length === 0 ? (
        <p className="text-gray-500">No scholarships available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedScholarships.map((s) => (
            <div
              key={s.id}
              className="p-5 bg-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-3 min-h-[3rem]">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
                  {s.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                  {s.type || "General"}
                </span>

                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    <span>Apply</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scholarships;
