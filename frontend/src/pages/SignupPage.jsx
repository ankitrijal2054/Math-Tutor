import { Link } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";
import GoogleSignIn from "../components/auth/GoogleSignIn";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute -bottom-8 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 hover:border-white/30 transition-colors duration-300">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Get Started
            </h1>
            <p className="text-slate-300 text-lg">🎓 Join AI Math Tutor</p>
            <p className="text-slate-400 text-sm">
              Create your learning account
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Google Sign-In */}
          <GoogleSignIn />

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-slate-400 space-y-2">
          <p>🚀 Get unlimited 24/7 tutoring</p>
          <p className="text-xs text-slate-500">
            No credit card required • Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
