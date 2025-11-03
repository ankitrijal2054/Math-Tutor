import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import GoogleSignIn from "../components/auth/GoogleSignIn";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="absolute -bottom-8 -right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 hover:border-white/30 transition-colors duration-300">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-300 text-lg">🎓 AI Math Tutor</p>
            <p className="text-slate-400 text-sm">
              Sign in to continue learning
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Google Sign-In */}
          <GoogleSignIn />

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-slate-400 space-y-2">
          <p>🌟 Learn mathematics through guided discovery</p>
          <p className="text-xs text-slate-500">
            Powered by AI & Socratic Method
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
