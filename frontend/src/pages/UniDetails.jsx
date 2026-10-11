import {
  MapPin,
  Globe,
  Mail,
  Phone,
  Building2,
  Award,
  Star,
  Bus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useUniversityStore } from "../store/useUniversityStore";
import { useEffect } from "react";
import ExpandableCard from "../components/ExpandableCard";

const UniDetails = () => {
  const { id } = useParams();

  const {
    selectedUniversities,
    fetchUniversityDetails,
    loading,
    error,
  } = useUniversityStore();

  useEffect(() => {
    if (id) {
      fetchUniversityDetails(id);
    }
  }, [id, fetchUniversityDetails]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Loading university details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Error: {error}
        </p>
      </div>
    );
  }

  if (!selectedUniversities) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          University not found.
        </p>
      </div>
    );
  }

  const universityName =
    selectedUniversities.university_name ||
    "Unknown University";

  const programs =
    selectedUniversities.programs?.map((program) => ({
      ...program,
      university_name: universityName,
    })) || [];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 mt-20">

        {/* Header */}
        <div className="flex gap-12 rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-auto flex justify-center">
            <img
              src={selectedUniversities.logo_url}
              alt={`${universityName} logo`}
              className="rounded-xl w-[14rem]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="lg:text-4xl md:text-3xl text-2xl font-extrabold">
              {universityName}
            </h1>

            <div className="flex items-center text-gray-600 rounded-2xl py-1 pl-1 mt-1">
              <div className="flex items-center bg-[hsl(var(--neon-cyan))] px-4 py-1 rounded-2xl">
                <MapPin size={16} className="mr-1" />
                {selectedUniversities.city}, Pakistan
              </div>
            </div>

            <p className="italic text-sm text-purple-800 font-bold mt-2">
              Leading the way in innovation and research excellence
            </p>

            <p className="text-gray-700 mt-3 text-md">
              {selectedUniversities.about}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 p-6 shadow-sm">

          {/* Programs */}
          <section className="bg-[#E3FBCC] p-6 rounded-2xl max-h-[500px] overflow-y-auto">
            <h2 className="text-xl font-extrabold mb-3">
              Programs Offered
            </h2>

            <ExpandableCard programs={programs} />
          </section>

          {/* Overview */}
          <section className="bg-[#ECE1FF] p-6 rounded-2xl">
            <h2 className="text-xl font-extrabold mb-8 text-purple-950">
              Overview
            </h2>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                {
                  icon: (
                    <Award
                      className="text-purple-700"
                      size={32}
                    />
                  ),
                  label: "Accreditations",
                  value:
                    "HEC"
                },
                {
                  icon: (
                    <Star
                      className="text-purple-700"
                      size={32}
                    />
                  ),
                  label: "Extracurriculars",
                  value:
                    selectedUniversities.extracurriculars ||
                    "Not specified",
                },
                {
                  icon: (
                    <Building2
                      className="text-purple-700"
                      size={32}
                    />
                  ),
                  label: "Hostel Facility",
                  value: selectedUniversities.has_hostel
                    ? "Available"
                    : "Not Available",
                },
                {
                  icon: (
                    <Bus
                      className="text-purple-700"
                      size={32}
                    />
                  ),
                  label: "Transport Facility",
                  value: selectedUniversities.has_transport
                    ? "Available"
                    : "Not Available",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {item.icon}
                    <span className="text-purple-950 font-medium">
                      {item.label}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-800 font-medium text-lg">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact & Apply */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3">
            Contact & Apply
          </h2>

          <div className="flex border border-gray-200 p-6 shadow-sm bg-white rounded-2xl">
            <div className="flex items-center rounded-xl w-[70%]">
              <ul className="space-y-10 text-sm text-gray-700">

                <div className="flex items-center">
                  <Mail
                    size={26}
                    className="mr-2 text-blue-500"
                  />

                  <div>
                    <span className="text-gray-500">
                      Email
                    </span>

                    <li className="text-lg font-medium">
                      {selectedUniversities.email_address}
                    </li>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone
                    size={26}
                    className="mr-2 text-blue-500"
                  />

                  <div>
                    <span className="text-gray-500">
                      Phone
                    </span>

                    <li className="text-lg font-medium">
                      {selectedUniversities.contact}
                    </li>
                  </div>
                </div>

                <div className="flex items-center">
                  <Globe
                    size={26}
                    className="mr-2 text-blue-500"
                  />

                  <div>
                    <span className="text-gray-500">
                      Website
                    </span>

                    <li className="text-lg font-medium">
                      {selectedUniversities.website}
                    </li>
                  </div>
                </div>

              </ul>
            </div>

            <div className="rounded-xl p-4 flex flex-col justify-center gap-6 w-[30%]">

              <a
                href={selectedUniversities.Apply}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 cursor-pointer text-center"
              >
                Apply Now
              </a>

              <a
                href={selectedUniversities.website}
                target="_blank"
                rel="noreferrer"
                className="flex text-gray-700 text-center justify-center items-center w-full border border-gray-300 py-4 rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                <Globe
                  size={20}
                  className="mr-2 text-gray-700"
                />
                Visit Website
              </a>

              <a
                href={selectedUniversities.Location}
                target="_blank"
                rel="noreferrer"
                className="flex text-gray-700 justify-center items-center w-full border border-gray-300 py-4 cursor-pointer rounded-xl hover:bg-gray-50"
              >
                <MapPin
                  size={20}
                  className="mr-2"
                />
                View on Map
              </a>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default UniDetails;