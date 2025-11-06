import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

const SymbolPad = ({ onSymbolSelect, isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Comprehensive math symbols organized by category
  const symbolCategories = {
    "Basic Operations": [
      { symbol: "+", label: "Plus" },
      { symbol: "−", label: "Minus" },
      { symbol: "×", label: "Multiply" },
      { symbol: "÷", label: "Divide" },
      { symbol: "=", label: "Equals" },
      { symbol: "≠", label: "Not Equal" },
      { symbol: "±", label: "Plus Minus" },
      { symbol: "∓", label: "Minus Plus" },
    ],
    Comparison: [
      { symbol: "<", label: "Less Than" },
      { symbol: ">", label: "Greater Than" },
      { symbol: "≤", label: "Less or Equal" },
      { symbol: "≥", label: "Greater or Equal" },
      { symbol: "≈", label: "Approximately" },
      { symbol: "∝", label: "Proportional" },
      { symbol: "≡", label: "Congruent" },
    ],
    Algebra: [
      { symbol: "√", label: "Square Root" },
      { symbol: "∛", label: "Cube Root" },
      { symbol: "^", label: "Exponent" },
      { symbol: "x²", label: "x Squared" },
      { symbol: "x³", label: "x Cubed" },
      { symbol: "∞", label: "Infinity" },
      { symbol: "π", label: "Pi" },
      { symbol: "θ", label: "Theta" },
    ],
    Calculus: [
      { symbol: "∫", label: "Integral" },
      { symbol: "∑", label: "Summation" },
      { symbol: "∏", label: "Product" },
      { symbol: "d/dx", label: "Derivative" },
      { symbol: "∂", label: "Partial" },
      { symbol: "∇", label: "Nabla" },
      { symbol: "lim", label: "Limit" },
      { symbol: "Δ", label: "Delta" },
    ],
    Geometry: [
      { symbol: "°", label: "Degree" },
      { symbol: "∠", label: "Angle" },
      { symbol: "⊥", label: "Perpendicular" },
      { symbol: "∥", label: "Parallel" },
      { symbol: "△", label: "Triangle" },
      { symbol: "⊙", label: "Circle" },
      { symbol: "≅", label: "Congruent" },
    ],
    "Logic & Sets": [
      { symbol: "∧", label: "And" },
      { symbol: "∨", label: "Or" },
      { symbol: "¬", label: "Not" },
      { symbol: "⇒", label: "Implies" },
      { symbol: "⇔", label: "If and Only If" },
      { symbol: "∀", label: "For All" },
      { symbol: "∃", label: "Exists" },
      { symbol: "∈", label: "Element Of" },
    ],
    "Greek Letters": [
      { symbol: "α", label: "Alpha" },
      { symbol: "β", label: "Beta" },
      { symbol: "γ", label: "Gamma" },
      { symbol: "δ", label: "Delta" },
      { symbol: "ε", label: "Epsilon" },
      { symbol: "λ", label: "Lambda" },
      { symbol: "μ", label: "Mu" },
      { symbol: "σ", label: "Sigma" },
    ],
    "Fractions & Powers": [
      { symbol: "½", label: "One Half" },
      { symbol: "⅓", label: "One Third" },
      { symbol: "¼", label: "One Quarter" },
      { symbol: "⅔", label: "Two Thirds" },
      { symbol: "¾", label: "Three Quarters" },
      { symbol: "⁰", label: "Superscript 0" },
      { symbol: "¹", label: "Superscript 1" },
      { symbol: "²", label: "Superscript 2" },
    ],
  };

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[75vh] overflow-hidden flex flex-col border border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 bg-slate-900">
          <h2 className="text-sm font-semibold text-white">Math Symbols</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Close symbol pad"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-3 py-2">
          {Object.entries(symbolCategories).map(([category, symbols]) => (
            <div key={category} className="mb-2">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                {category}
              </h3>
              <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-14 lg:grid-cols-16 gap-0">
                {symbols.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => {
                      onSymbolSelect(item.symbol);
                      onClose();
                    }}
                    title={item.label}
                    className="h-7 w-7 flex items-center justify-center bg-slate-700 hover:bg-indigo-600 text-white font-medium rounded transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-600 hover:border-indigo-500 text-xs"
                  >
                    {item.symbol}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-1 border-t border-slate-700 bg-slate-900 text-xs text-slate-400">
          Click any symbol to add it to your message. Press ESC to close.
        </div>
      </div>
    </div>
  );
};

export default SymbolPad;
