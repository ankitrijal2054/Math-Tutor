import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUpWithEmail, createUserProfile } from "../../services/auth";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sign up user
      const user = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName
      );

      // Create user profile in Firestore
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: formData.displayName,
      });

      navigate("/chat");
    } catch (error) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Display Name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Enter your name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white/10 backdrop-blur text-white placeholder-slate-400 ${
            errors.displayName
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
              : "border-white/20 focus:ring-indigo-500/30 focus:border-indigo-400"
          }`}
          disabled={loading}
        />
        {errors.displayName && (
          <p className="mt-2 text-sm text-red-400">{errors.displayName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white/10 backdrop-blur text-white placeholder-slate-400 ${
            errors.email
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
              : "border-white/20 focus:ring-indigo-500/30 focus:border-indigo-400"
          }`}
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white/10 backdrop-blur text-white placeholder-slate-400 ${
            errors.password
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
              : "border-white/20 focus:ring-indigo-500/30 focus:border-indigo-400"
          }`}
          disabled={loading}
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 bg-white/10 backdrop-blur text-white placeholder-slate-400 ${
            errors.confirmPassword
              ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500"
              : "border-white/20 focus:ring-indigo-500/30 focus:border-indigo-400"
          }`}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full pt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
};

export default SignupForm;
