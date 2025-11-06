import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
          <div
            className="absolute -bottom-40 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </div>

      {/* PART 1: HERO SECTION - Full Viewport Height */}
      <div className="relative h-screen w-full flex flex-col overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-20 flex justify-between items-center px-4 md:px-12 py-4 md:py-6">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="text-2xl md:text-3xl transform group-hover:scale-110 transition-transform duration-300">
              📐
            </div>
            <span className="text-base md:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Math Tutor
            </span>
          </Link>
          <div className="flex gap-2 md:gap-4">
            <Link
              to="/login"
              className="px-3 md:px-6 py-2 text-xs md:text-sm font-semibold text-slate-200 hover:text-white transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-3 md:px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-xs md:text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content - Centered */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-8">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left - Text Content */}
              <div className="flex flex-col justify-center space-y-5 md:space-y-7">
                <div className="space-y-3 md:space-y-5">
                  <div className="inline-block">
                    <span className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-full text-xs md:text-sm font-semibold text-indigo-300">
                      ✨ Socratic Learning
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                      Learn Math
                    </span>
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent block">
                      Like Never Before
                    </span>
                  </h1>
                  <p className="text-sm md:text-lg text-slate-300 leading-relaxed max-w-md">
                    Master mathematics through guided discovery with your
                    personal AI tutor. No lectures, just questions.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                  <Link
                    to="/signup"
                    className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 text-center text-sm md:text-base"
                  >
                    Start Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 md:px-8 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-center text-sm md:text-base"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="pt-2 flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span>Personalized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span>24/7 Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚀</span>
                    <span>Free to Start</span>
                  </div>
                </div>
              </div>

              {/* Right - Animated SVG Visualization */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-full flex items-center justify-center min-h-80">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full max-w-md drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(99, 102, 241, 0.3))",
                  }}
                >
                  {/* Gradients and Filters */}
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#a78bfa", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#2dd4bf", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#f87171", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#fbbf24", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Background circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="190"
                    fill="rgba(30, 27, 75, 0.5)"
                    stroke="url(#grad1)"
                    strokeWidth="2"
                  />

                  {/* Decorative graffiti elements */}
                  <text
                    x="80"
                    y="100"
                    fontSize="64"
                    fill="url(#grad1)"
                    fontWeight="bold"
                    opacity="0.8"
                    filter="url(#glow)"
                    fontStyle="italic"
                  >
                    π
                  </text>

                  <text
                    x="260"
                    y="140"
                    fontSize="56"
                    fill="url(#grad2)"
                    fontWeight="bold"
                    opacity="0.7"
                    filter="url(#glow)"
                  >
                    ∞
                  </text>

                  <text
                    x="120"
                    y="300"
                    fontSize="48"
                    fill="#22c55e"
                    fontWeight="bold"
                    opacity="0.6"
                    filter="url(#glow)"
                  >
                    √
                  </text>

                  <text
                    x="280"
                    y="300"
                    fontSize="52"
                    fill="#14b8a6"
                    fontWeight="bold"
                    opacity="0.7"
                    filter="url(#glow)"
                  >
                    Σ
                  </text>

                  {/* Mathematical expressions */}
                  <text
                    x="50"
                    y="220"
                    fontSize="16"
                    fill="rgba(167, 139, 250, 0.6)"
                    fontFamily="monospace"
                  >
                    e^(πi) = -1
                  </text>

                  <text
                    x="220"
                    y="250"
                    fontSize="16"
                    fill="rgba(45, 212, 191, 0.6)"
                    fontFamily="monospace"
                  >
                    f(x) = x²
                  </text>

                  {/* Connecting lines */}
                  <line
                    x1="100"
                    y1="110"
                    x2="280"
                    y2="150"
                    stroke="url(#grad1)"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  <line
                    x1="150"
                    y1="310"
                    x2="280"
                    y2="310"
                    stroke="url(#grad2)"
                    strokeWidth="2"
                    opacity="0.3"
                  />

                  {/* Animated stars */}
                  <circle cx="200" cy="80" r="3" fill="#fbbf24" opacity="0.8">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.8;0.3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="320"
                    cy="200"
                    r="2.5"
                    fill="#22c55e"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.2;0.7;0.2"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="80" cy="200" r="2.5" fill="#a78bfa" opacity="0.7">
                    <animate
                      attributeName="opacity"
                      values="0.3;0.9;0.3"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Scroll to explore
            </span>
            <ChevronDown size={20} className="text-indigo-400" />
          </div>
        </div>
      </div>

      {/* PART 2: SCROLLABLE CONTENT */}
      <div className="relative z-0">
        {/* Features Showcase Section */}
        <div className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                Everything you need to master mathematics through guided
                learning
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {[
                {
                  icon: "🤔",
                  title: "Socratic Method",
                  desc: "Get guided through problems with thoughtful questions instead of direct answers",
                  color: "from-indigo-500 to-purple-500",
                },
                {
                  icon: "🖼️",
                  title: "Visual Learning",
                  desc: "Upload images, use the whiteboard, or work with visual diagrams",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: "🎓",
                  title: "Smart Practice",
                  desc: "Generate unlimited practice problems similar to ones you've mastered",
                  color: "from-pink-500 to-rose-500",
                },
                {
                  icon: "🎵",
                  title: "Voice Support",
                  desc: "Learn with speech-to-text input and text-to-speech output",
                  color: "from-rose-500 to-orange-500",
                },
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-300`}
                  ></div>
                  <div className="relative bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl p-6 md:p-8 transition-all duration-300 group-hover:bg-white/10 h-full">
                    <div className="text-5xl md:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16 md:py-24 px-4 md:px-8 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              {[
                {
                  step: "01",
                  title: "Ask Your Question",
                  description:
                    "Type, upload an image, or draw on the whiteboard to share your math problem.",
                  icon: "❓",
                },
                {
                  step: "02",
                  title: "Get Guided Questions",
                  description:
                    "Our Socratic AI asks you leading questions to help you think through the problem.",
                  icon: "💭",
                },
                {
                  step: "03",
                  title: "Build Understanding",
                  description:
                    "Through guided discovery, you'll develop deeper conceptual understanding and mastery.",
                  icon: "🧠",
                },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-purple-600/10 to-teal-600/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 md:p-8 transition-all duration-300 group-hover:bg-white/10 h-full flex flex-col">
                    <div className="text-5xl md:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-500/50 rounded-full text-xs md:text-sm font-semibold text-indigo-300 mb-4 w-fit">
                      Step {item.step}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-white">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-16 md:py-24 px-4 md:px-8 border-t border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Master Math?
                </span>
              </h2>
              <p className="text-base md:text-xl text-slate-400">
                Join students learning mathematics through guided discovery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
              <Link
                to="/signup"
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 text-center text-sm md:text-base"
              >
                Start Free Today
              </Link>
              <Link
                to="/login"
                className="px-6 md:px-8 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 hover:border-white/30 transition-all duration-300 text-center text-sm md:text-base"
              >
                Sign In
              </Link>
            </div>

            {/* Footer */}
            <div className="pt-8 md:pt-12 border-t border-slate-800 space-y-3 text-xs md:text-sm text-slate-500">
              <p>🎓 Learning Math Through Guided Discovery</p>
              <p>© 2025 AI Math Tutor. Powered by Socratic Method & AI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
