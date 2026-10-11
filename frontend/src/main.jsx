// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App.jsx";
// import "./index.css";
// import HeroSection from "./components/HeroSection.jsx";
// import ExploreUniversities from "./pages/ExploreUniversities.jsx";
// import UniDetails from "./pages/UniDetails.jsx";
// import Signup from "./components/Signup.jsx";
// import Login from "./components/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import StudentDashboard from "./components/StudentDashboard.jsx";
// import CompleteProfile from "./components/CompleteProfile.jsx";
// import Dashboard from "./components/DashboardLayout/Dashboard.jsx";

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       // public routes
//       {
//         path: '/',
//         element: <HeroSection />
//       },
//       {
//         path: '/home',
//         element: <HeroSection/>
//       },
//       {
//         path: '/explore',
//         element: <ExploreUniversities />
//       },
//       {
//         path: '/university-details/:id',
//         element: <UniDetails />
//       },
//       {
//         path: '/signup',
//         element: <Signup/>
//       },
//       {
//         path: '/login',
//         element: <Login/>
//       },

//       // Protected route (dashboard only after profile completionn)
//       {
//         element: <ProtectedRoute requireProfile={true}/>,
//         children: [{ path: "/student-dashboard", element: <Dashboard/>}],
//       },

//       // Semi-protected route (for profile completion)
//       {
//         element: <ProtectedRoute requireProfile={false}/>,
//         children: [{ path: "/complete-profile", element: <CompleteProfile/>}],
//       }
//     ]
//   }
// ])

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router}/>
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import HeroSection from "./components/HeroSection.jsx";
import ExploreUniversities from "./pages/ExploreUniversities.jsx";
import UniDetails from "./pages/UniDetails.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CompleteProfile from "./components/CompleteProfile.jsx";
import Dashboard from "./components/DashboardLayout/Dashboard.jsx";
// import Recommendations from "./components/DashboardLayout/Recommendations.jsx";
import AllRecommendations from "./components/DashboardLayout/AllRecommendation.jsx";
// import DashboardLayout from "./components/DashboardLayout/DashboardLayout.jsx";
// import RecommendationsPage from "./components/DashboardLayout/RecommendationsPage.jsx";
// import SavedUniversitiesPage from "./components/DashboardLayout/SavedUniversitiesPage.jsx";
// import ProfilePage from "./components/DashboardLayout/ProfilePage.jsx";
// import SettingsPage from "./components/DashboardLayout/SettingsPage.jsx";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout.jsx";
import Profile from "./components/DashboardLayout/Profile.jsx";
import AllScholarships from "./components/DashboardLayout/AllScholarships.jsx";
import WhatIf from "./components/DashboardLayout/WhatIf.jsx";
import AIAdvisor from "./components/DashboardLayout/AIAdvisor.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      { path: '/', element: <HeroSection /> },
      { path: '/home', element: <HeroSection /> },
      { path: '/explore', element: <ExploreUniversities /> },
      { path: '/university-details/:id', element: <UniDetails /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },

      // Protected route (dashboard only after profile completion)
      {
        element: <ProtectedRoute requireProfile={true} />,
        children: [
          {
            path: "/student-dashboard",
            element: <DashboardLayout />,
            children: [
              {path: "/student-dashboard", element: <Dashboard/>},
              { path: "/student-dashboard/recommendations", element: <AllRecommendations /> },
              {path: "/student-dashboard/profile", element: <Profile/>},
              {path: "/student-dashboard/scholarships", element: <AllScholarships/>},
              {path: "/student-dashboard/what-if", element: <WhatIf/>},
              {path: "/student-dashboard/advisor", element: <AIAdvisor/>},
            ],
          },
        ],
      },

      // Semi-protected route (for profile completion)
      {
        element: <ProtectedRoute requireProfile={false} />,
        children: [{ path: "/complete-profile", element: <CompleteProfile /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
