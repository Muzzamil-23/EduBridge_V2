import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const UniCard = ({ uni }) => {
  const navigate = useNavigate()
  return (
    <div className="relative bg-[hsl(var(--background))] rounded-3xl overflow-hidden shadow-xl border border-white/10 hover:scale-[1.02] transition-all duration-300">
      {/* uni Image */}
      <div className="relative">
        <img
          src={uni?.image_url}
          alt={uni?.uni_name}
          className="h-96 w-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Location badge */}
        <div className="absolute top-4 left-4 text-white bg-green-500 text-sm font-semibold px-4 py-1 rounded-full shadow-md">
          {uni?.type || "Unknown"}
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 w-full text-white">
        <h3 className="text-2xl font-extrabold mb-2">
          {uni?.university_name}
        </h3>
        <p className="text-sm text-gray-200 mb-5 line-clamp-3">
          {uni?.about ||
            "Empowering underserved communities through quality higher education."}
        </p>

        <button
          className="group flex items-center gap-1 cursor-pointer"
          onClick={() => navigate(`/university-details/${uni?.uni_id}`)}
        >
          <span>View Details</span>
          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-2"
          />
        </button>

      </div>
    </div>
  )
}

export default UniCard
