import React, { useState, useEffect } from "react";
import { X, Volume2, Zap } from "lucide-react";
import { useOpenAIVoice } from "../../hooks/useOpenAIVoice";
import toast from "react-hot-toast";

const VoiceSettings = ({ isOpen, onClose }) => {
  const voice = useOpenAIVoice();
  const [tempVoice, setTempVoice] = useState(voice.voice);
  const [tempSpeed, setTempSpeed] = useState(voice.speed);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Update temp values when voice settings change
  useEffect(() => {
    setTempVoice(voice.voice);
    setTempSpeed(voice.speed);
  }, [voice.voice, voice.speed]);

  const handleApply = () => {
    voice.setVoice(tempVoice);
    voice.setSpeed(tempSpeed);
    onClose();
  };

  const handleReset = () => {
    setTempVoice("nova");
    setTempSpeed(1.0);
    voice.setVoice("nova");
    voice.setSpeed(1.0);
    localStorage.removeItem("openaiVoiceSettings");
  };

  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    try {
      await voice.testVoice();
    } catch (error) {
      console.error("Test voice error:", error);
      // Error toast is handled by the hook
    } finally {
      setIsTestingVoice(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {!voice.isSupported && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-300 text-sm">
                Voice features are not available. Please check your TTS
                configuration.
              </div>
            )}

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Voice
              </label>
              <select
                value={tempVoice}
                onChange={(e) => setTempVoice(e.target.value)}
                disabled={!voice.isSupported}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {voice.voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Choose your preferred voice for text-to-speech
              </p>
            </div>

            {/* Speech Speed */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Speech Speed:{" "}
                <span className="text-indigo-400">
                  {(tempSpeed * 100).toFixed(0)}%
                </span>
              </label>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={tempSpeed}
                onChange={(e) => setTempSpeed(parseFloat(e.target.value))}
                disabled={!voice.isSupported}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Slow (0.25x)</span>
                <span>Normal (1x)</span>
                <span>Fast (4x)</span>
              </div>
            </div>

            {/* Calls Remaining */}
            {voice.callsRemaining !== null && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded text-indigo-300 text-sm">
                TTS calls remaining today:{" "}
                <span className="font-semibold">{voice.callsRemaining}</span>
              </div>
            )}

            {/* Test Button */}
            <button
              onClick={handleTestVoice}
              disabled={
                !voice.isSupported || isTestingVoice || voice.isGenerating
              }
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isTestingVoice || voice.isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-indigo-600 rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Test Voice
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-2 p-6 border-t border-slate-700 justify-end">
            <button
              onClick={handleReset}
              disabled={!voice.isSupported}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
            >
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!voice.isSupported}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceSettings;
