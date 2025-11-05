import React, { useState, useEffect } from "react";
import { X, Volume2, Zap } from "lucide-react";
import { useVoice } from "../../hooks/useVoice";
import toast from "react-hot-toast";

const VoiceSettings = ({ isOpen, onClose }) => {
  const voice = useVoice();
  const [tempRate, setTempRate] = useState(voice.speechRate);
  const [tempVolume, setTempVolume] = useState(voice.volume);

  // Update temp values when voice settings change
  useEffect(() => {
    setTempRate(voice.speechRate);
    setTempVolume(voice.volume);
  }, [voice.speechRate, voice.volume]);

  const handleApply = () => {
    voice.setSpeechRate(tempRate);
    voice.setVolume(tempVolume);

    // Save to localStorage
    localStorage.setItem(
      "voiceSettings",
      JSON.stringify({
        speechRate: tempRate,
        volume: tempVolume,
      })
    );

    toast.success("Voice settings saved");
    onClose();
  };

  const handleReset = () => {
    setTempRate(1);
    setTempVolume(1);
    voice.setSpeechRate(1);
    voice.setVolume(1);
    localStorage.removeItem("voiceSettings");
    toast.success("Voice settings reset to defaults");
  };

  const handleTestVoice = () => {
    const testText = `Hello! I'm testing the voice settings at ${(
      tempRate * 100
    ).toFixed(0)}% speed.`;
    voice.speak(testText);
    toast.success("Playing test audio");
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
                Voice features are not supported on this browser.
              </div>
            )}

            {/* Speech Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Speech Speed:{" "}
                <span className="text-indigo-400">
                  {(tempRate * 100).toFixed(0)}%
                </span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={tempRate}
                onChange={(e) => setTempRate(parseFloat(e.target.value))}
                disabled={!voice.isSupported}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Slower (0.5x)</span>
                <span>Normal (1x)</span>
                <span>Faster (2x)</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Volume:{" "}
                <span className="text-indigo-400">
                  {(tempVolume * 100).toFixed(0)}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={tempVolume}
                onChange={(e) => setTempVolume(parseFloat(e.target.value))}
                disabled={!voice.isSupported}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Mute</span>
                <span>Normal</span>
                <span>Max</span>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTestVoice}
              disabled={!voice.isSupported}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Test Voice
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
