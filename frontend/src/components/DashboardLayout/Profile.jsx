import { useAuthStore } from "../../store/useAuthStore";
import { CheckCircle2 } from "lucide-react";

const Profile = () => {
    const { profile } = useAuthStore();

    const personal = profile?.personal || {};
    const academic = profile?.academic || {};

    // ✅ Personal Info
    const personalData = [
        { label: "First Name", value: personal.first_name || "N/A" },
        { label: "Last Name", value: personal.last_name || "N/A" },
        { label: "Email", value: personal.email || "N/A" },
        { label: "Age", value: personal.age || "N/A" },
    ];

    // ✅ Academic Info
    const academicData = [
        { label: "Preferred University Type", value: academic.preferred_university_type || "N/A" },
        { label: "Academic Percentage", value: academic.academic_percentage + "%" || "N/A"},
        { label: "Preferred Program Group", value: academic.preferred_program_group || "N/A" },
        {
            label: "Per Semester Budget",
            value: academic.per_semester_budget ? `Rs ${academic.per_semester_budget}` : "N/A",
        },
        { label: "Scholarship Requirement", value: academic.scholarship_requirement ? "Yes" : "No" },
        { label: "Hostel Requirement", value: academic.hostel_requirement ? "Yes" : "No" },
        { label: "Transport Requirement", value: academic.transport_requirement ? "Yes" : "No" },
        { label: "Specific Universities", value: academic.specific_universities || "N/A" },
        { label: "Entry Test Requirement", value: academic.entry_test_requirement ? "Yes" : "No" },
    ];

    return (
        <div className="p-8 bg-white rounded-2xl shadow-lg mt-6">
            {/* --- Header Section --- */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src="https://img.icons8.com/?size=100&id=Fx9MBGycMHE3&format=png&color=000000"
                        alt="id-card"
                        className="w-10 h-10"
                    />
                    <h2 className="text-2xl font-bold text-purple-700">Profile Overview</h2>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Profile Completed</span>
                </div>
            </div>

            {/* --- Personal Information --- */}
            <div className="pt-6 mb-10">
                <div className="flex items-center gap-2 mb-6">
                    <img
                        src="https://img.icons8.com/?size=100&id=IerOpHeUt2OH&format=png&color=CC5DE8"
                        alt="user-icon"
                        className="w-8 h-8"
                    />
                    <h3 className="text-xl font-bold text-gray-800">
                        Personal Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    {personalData.map((item, index) => (
                        <div key={index}>
                            <p className="text-sm text-gray-500 font-medium mb-2">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Academic Information --- */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src="https://img.icons8.com/?size=100&id=RtVsNpVhmJeJ&format=png&color=000000"
                        alt="books"
                        className="w-8 h-8"
                    />
                    <h3 className="text-xl font-bold text-gray-800">
                        Academic Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
                    {academicData.map((item, index) => (
                        <div key={index}>
                            <p className="text-sm text-gray-500 font-medium mb-2">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
