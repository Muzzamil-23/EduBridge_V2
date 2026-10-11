import { useEffect } from "react";
import { useUniversityStore } from "../../store/useUniversityStore";
import { ArrowRight } from "lucide-react";
import Loader from "../Loader"; // ✅ import your Loader component

const AllScholarships = () => {
  const { scholarships, fetchScholarships, loading } = useUniversityStore();

  useEffect(() => {
    fetchScholarships();
    // ✅ Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-[-10px] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src="https://img.icons8.com/?size=100&id=fKJgvKmH6NsF&format=png&color=000000"
            alt="scholarship-icon"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            All Scholarships
          </h1>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
            <p>Loading Scholarships...</p>
        </div>
      ) : scholarships.length === 0 ? (
        <p className="text-gray-500">No scholarships available right now.</p>
      ) : (
        <div className="bg-[#CBB1EF] px-6 py-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="p-5 bg-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition flex flex-col justify-between h-[190px]"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {s.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-snug">
                    {s.description}
                  </p>
                </div>

                <div className="flex justify-between items-center">
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
        </div>
      )}
    </div>
  );
};

export default AllScholarships;
