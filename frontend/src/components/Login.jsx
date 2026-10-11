// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema } from "../validations/authSchema";
// import authService from "../supabase/authService";
// import { Chrome, Loader2, Lock, Mail } from "lucide-react";

// const Login = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const loginHandler = async (data) => {
//     setError("");
//     setLoading(true);
//     try {
//       const session = await authService.login(data);
//       if (session) navigate("/"); // redirect after login
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
//       <div className="w-full max-w-md p-8 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 shadow-lg">
//         {/* header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-semibold text-gray-800">Welcome Back</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Sign in to continue to EduBridge
//           </p>
//         </div>

//         {/* form */}
//         <form onSubmit={handleSubmit(loginHandler)} noValidate className="space-y-5">
//           {/* Email field */}
//           <div>
//             <label
//               htmlFor="email"
//               className="text-sm font-medium text-gray-700"
//             >
//               Email
//             </label>
//             <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 bg-transparent focus-within:border-blue-500 transition">
//               <Mail size={18} className="text-gray-400" />
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="you@example.com"
//                 className="w-full bg-transparent outline-none ml-2 text-gray-800"
//                 {...register("email")}
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password field */}
//           <div>
//             <label
//               htmlFor="password"
//               className="text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 bg-transparent focus-within:border-blue-500 transition">
//               <Lock size={18} className="text-gray-400" />
//               <input
//                 type="password"
//                 id="password"
//                 placeholder="Enter password"
//                 className="w-full bg-transparent outline-none ml-2 text-gray-800"
//                 {...register("password")}
//               />
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2.5 mt-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
//               loading
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading && <Loader2 className="animate-spin" size={18} />}
//             {loading ? "Signing In..." : "Sign In"}
//           </button>

//           {/* error */}
//           {error && <p className="text-red-500 text-center mt-3">{error}</p>}

//           {/* footer link */}
//           <div className="text-center text-sm mt-6 text-gray-600">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-blue-500 hover:text-blue-600"
//             >
//               Create one
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validations/authSchema";
import authService from "../supabase/authService";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import profileService from "../supabase/profileService";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginHandler = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await authService.login(data);
      if (session?.user) {
        const isCompleted = await profileService.isProfileCompleted(session.user.id);
        if (isCompleted) navigate("/");
        else navigate("/complete-profile");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-3xl flex flex-col md:flex-row overflow-hidden">
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-50 items-center justify-center relative">
          <img
            src="./images/gradient-mba-illustration.png"
            alt="Login Illustration"
            className="w-3/4 max-w-md drop-shadow-lg animate-fade-in mb-10"
          />
          <div className="absolute bottom-10 text-center px-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Empowering Education
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Bridge the gap between learners and universities with EduBridge.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome Back 👋</h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to continue your journey with EduBridge
            </p>
          </div>

          <form onSubmit={handleSubmit(loginHandler)} noValidate className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none ml-2 text-gray-800"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition relative">
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  className="w-full bg-transparent outline-none ml-2 text-gray-800 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {/* Error */}
            {error && <p className="text-red-500 text-center mt-3">{error}</p>}

            {/* Footer Link */}
            <div className="text-center text-sm mt-6 text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
