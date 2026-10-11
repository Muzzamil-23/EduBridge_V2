// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signUpSchema } from "../validations/authSchema";
// import { Loader2, Lock, Mail, UserPlus } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";

// const Signup = () => {
//   const createAccount = useAuthStore((state) => state.createAccount);
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//   });

//   const signupHandler = async (data) => {
//     setError("");
//     setLoading(true);
//     try {
//       const session = await createAccount(data);
//       if (session) navigate("/login");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4">
//       <div className="w-full max-w-6xl bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-3xl flex flex-col md:flex-row overflow-hidden">
        
//         {/* Illustration Section */}
//         <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-50 items-center justify-center relative">
//           <img
//             src="./images/gradient-mba-illustration.png"
//             alt="Signup Illustration"
//             className="w-3/4 max-w-md drop-shadow-lg animate-fade-in mb-10"
//           />
//           <div className="absolute bottom-10 text-center px-6">
//             <h2 className="text-2xl font-bold text-blue-700">
//               Start Your Journey
//             </h2>
//             <p className="text-sm text-gray-600 mt-1">
//               Discover universities and connect your academic goals with EduBridge.
//             </p>
//           </div>
//         </div>

//         {/* Form Section */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <div className="text-center mb-10">
//             <h1 className="text-4xl font-bold text-gray-800">
//               Create Your Account ✨
//             </h1>
//             <p className="text-gray-500 text-sm mt-2">
//               Join EduBridge to explore programs & connect with top universities
//             </p>
//           </div>

//           <form onSubmit={handleSubmit(signupHandler)} className="space-y-6" noValidate>
//             {/* Email field */}
//             <div>
//               <label htmlFor="email" className="text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
//                 <Mail size={18} className="text-gray-400" />
//                 <input
//                   type="email"
//                   id="email"
//                   placeholder="you@example.com"
//                   className="w-full bg-transparent outline-none ml-2 text-gray-800"
//                   {...register("email")}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password field */}
//             <div>
//               <label htmlFor="password" className="text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
//                 <Lock size={18} className="text-gray-400" />
//                 <input
//                   type="password"
//                   id="password"
//                   placeholder="Enter password"
//                   className="w-full bg-transparent outline-none ml-2 text-gray-800"
//                   {...register("password")}
//                 />
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 mt-4 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
//                 loading
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading && <Loader2 className="animate-spin" size={18} />}
//               {loading ? "Creating Account..." : <><UserPlus size={18} /> Create Account</>}
//             </button>

//             {/* Error message */}
//             {error && <p className="text-red-500 text-center mt-3">{error}</p>}

//             {/* Footer */}
//             <div className="text-center text-sm mt-6 text-gray-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
//                 Sign in
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../validations/authSchema";
import { Loader2, Lock, Mail, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Signup = () => {
  const createAccount = useAuthStore((state) => state.createAccount);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ state for toggling visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const signupHandler = async (data) => {
    setError("");
    setLoading(true);
    try {
      const session = await createAccount(data);
      if (session) navigate("/login");
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
            alt="Signup Illustration"
            className="w-3/4 max-w-md drop-shadow-lg animate-fade-in mb-10"
          />
          <div className="absolute bottom-10 text-center px-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Start Your Journey
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Discover universities and connect your academic goals with EduBridge.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Create Your Account ✨
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Join EduBridge to explore programs & connect with top universities
            </p>
          </div>

          <form onSubmit={handleSubmit(signupHandler)} className="space-y-6" noValidate>
            {/* Email field */}
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

            {/* Password field with toggle */}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
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
              {loading ? "Creating Account..." : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>

            {/* Error message */}
            {error && <p className="text-red-500 text-center mt-3">{error}</p>}

            {/* Footer */}
            <div className="text-center text-sm mt-6 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
