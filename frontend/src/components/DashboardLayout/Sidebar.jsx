// Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  StarIcon,
  UserIcon,
  GraduationCap,
  LogOut,
  MessageCircleQuestionMark,
  BotMessageSquare,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/student-dashboard" },
  { name: "Recommendations", icon: StarIcon, path: "/student-dashboard/recommendations" },
  { name: "Scholarships", icon: GraduationCap, path: "/student-dashboard/scholarships" },
  { name: "Profile", icon: UserIcon, path: "/student-dashboard/profile" },
  { name: "What If", icon: MessageCircleQuestionMark, path: "/student-dashboard/what-if"},
  { name: "AI Advisor", icon: BotMessageSquare, path: "/student-dashboard/advisor"},
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`bg-[#101828] text-gray-100 shadow-xl h-screen flex flex-col justify-between transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* --- Top Section --- */}
      <div>
        {/* Logo & toggle */}
        <div className={`flex items-center ${isOpen ? "justify-between" : ""} p-4`}>
          <h1
            className={`text-white text-2xl font-bold transition-all duration-300 ${!isOpen && "opacity-0 w-0 overflow-hidden"
              }`}
          >
            EduBridge
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors hover:cursor-pointer hover:bg-[#283043]"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-12 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-3 m-2 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-[#BFA1E7] text-gray-900 shadow-md"
                    : "text-gray-100 hover:bg-[#BFA1E7] hover:text-gray-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-black" : "text-white group-hover:text-black"
                        }`}
                    />
                    <span
                      className={`transition-all duration-300 ${!isOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                        }`}
                    >
                      {item.name}
                    </span>

                    {/* Tooltip */}
                    {!isOpen && (
                      <span className="absolute left-full top-1/2 -translate-y-1/2 text-white ml-2 whitespace-nowrap bg-[#111111] text-sm px-2 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* --- Logout Button --- */}
      {/* --- Logout Button --- */}
      <div className="flex pl-6 mb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 hover:cursor-pointer transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>


    </aside>
  );
};

export default Sidebar;
