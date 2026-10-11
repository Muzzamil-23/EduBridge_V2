import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import Loader from "./components/Loader";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const authLoading = useAuthStore((state) => state.loading);

  const location = useLocation();

  // Fetch user session on app load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const hideNavbar = [
    "/login",
    "/signup",
    "/student-dashboard",
    "/complete-profile",
    "/student-dashboard/recommendations",
    "/student-dashboard/profile",
    "/student-dashboard/scholarships",
    "/student-dashboard/what-if",
    "/student-dashboard/advisor",
  ].includes(location.pathname);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}

export default App;
