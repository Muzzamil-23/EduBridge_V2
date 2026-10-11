import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";


const ProtectedRoute = ({ requireProfile = false }) => {
  const { user, isProfileCompleted, loading } = useAuthStore();

  
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  //  console.log("🔍 ProtectedRoute state:", { user, isProfileCompleted, loading });
  if (!user) return <Navigate to="/login"/>;

  // 🚫 Not logged in

  // 🚧 Logged in but profile incomplete and route requires profile
  if (requireProfile && !isProfileCompleted)
    return <Navigate to="/complete-profile"/>;

  // ✅ Everything good
  return <Outlet />;
};

export default ProtectedRoute;



// import { useState, useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";

// const ProtectedRoute = ({ requireProfile = false }) => {
//   const { user, isProfileComplete, loading } = useAuthStore();
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     // ⏳ Wait a bit for Supabase session restore
//     const timer = setTimeout(() => {
//       setIsChecking(false);
//     }, 500); // 0.5 second delay is enough

//     return () => clearTimeout(timer);
//   }, [user, loading]);

//   if (loading || isChecking) {
//     return <p className="text-center mt-10">Checking session...</p>;
//   }

//   // 🚫 Not logged in
//   if (!user) return <Navigate to="/login" replace />;

//   // 🚧 Logged in but profile incomplete
//   if (requireProfile && !isProfileComplete)
//     return <Navigate to="/complete-profile" replace />;

//   // ✅ All good
//   return <Outlet />;
// };

// export default ProtectedRoute;

