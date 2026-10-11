import React, { useEffect, useState, useMemo } from "react";
import { useUniversityStore } from "../store/useUniversityStore";
import UniCardSkeleton from "../components/UniCardSkeleton";
import UniCard from "../components/UniCard";
import Dropdown from "../components/Dropdown";
import { Search } from "lucide-react";

const ExploreUniversities = () => {
  const {
    universities,
    fetchUniversities,
    loading,
    error,
  } = useUniversityStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // Fetch universities when this page is opened
  useEffect(() => {
    if (universities.length === 0 && !loading) {
      fetchUniversities();
    }
  }, [fetchUniversities, universities.length, loading]);

  // --- Filter logic ---
  const filteredUniversities = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return universities
      .filter((uni) => {
        const name =
          uni.university_name ||
          uni.name ||
          uni.University_Name ||
          uni.universityName ||
          "";

        return name.toLowerCase().includes(term);
      })
      .filter((uni) => {
        if (typeFilter === "All") return true;

        const type =
          uni.type ||
          uni.Type ||
          uni.university_type ||
          "";

        return type.toLowerCase() === typeFilter.toLowerCase();
      });
  }, [universities, searchTerm, typeFilter]);

  // --- Pagination logic ---
  const totalPages = Math.ceil(
    filteredUniversities.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentUniversities =
    filteredUniversities.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* ===== Header ===== */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold mt-10">
            Explore Universities in{" "}
            <span className="text-[#5E4BEC] font-extrabold">
              Karachi
            </span>
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Discover Pakistan’s leading universities — compare programs, fees,
            and admission details to find your perfect match.
          </p>
        </div>

        {/* ===== Search + Filter Section ===== */}
        <div className="mb-20 max-w-3xl m-auto mt-10">
          <div className="flex flex-col md:flex-row md:items-stretch gap-4">

            {/* Search Bar */}
            <div className="relative flex-1 top-[28px] w-full">
              <Search
                className="absolute left-4 top-3.5 text-[#5E4BEC]/70"
                size={20}
              />

              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400
                  rounded-xl pl-12 pr-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E4BEC]
                  transition-all duration-300"
              />
            </div>

            {/* University Type Filter */}
            <div className="w-full md:w-48 relative z-50">
              <span className="text-blue-600 font-semibold px-1">
                University Type
              </span>

              <Dropdown
                options={["All", "Public", "Private"]}
                selected={typeFilter}
                onChange={setTypeFilter}
              />
            </div>
          </div>
        </div>

        {/* ===== University Grid ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 -z-20 mb-8">
          {loading
            ? Array(itemsPerPage)
                .fill(null)
                .map((_, i) => (
                  <UniCardSkeleton key={i} />
                ))
            : currentUniversities.length > 0
            ? currentUniversities.map((uni, i) => (
                <UniCard
                  key={
                    uni?.uni_id ||
                    uni?.id ||
                    i
                  }
                  uni={uni}
                />
              ))
            : (
              <p className="text-gray-500 text-center col-span-full">
                No universities found.
              </p>
            )}
        </div>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-14 gap-2 flex-wrap mb-20">

            <button
              onClick={() =>
                handlePageChange(currentPage - 1)
              }
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium transition-all duration-300
                ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "hover:bg-[#5E4BEC]/10 text-gray-700 hover:text-[#5E4BEC]"
                }`}
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  handlePageChange(i + 1)
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 cursor-pointer
                  ${
                    currentPage === i + 1
                      ? "bg-[#5E4BEC] text-white border-[#5E4BEC] shadow-md"
                      : "border-gray-200 text-gray-700 hover:bg-[#5E4BEC]/10 hover:text-[#5E4BEC]"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                handlePageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium transition-all duration-300 cursor-pointer
                ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "hover:bg-[#5E4BEC]/10 text-gray-700 hover:text-[#5E4BEC]"
                }`}
            >
              Next →
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreUniversities;
