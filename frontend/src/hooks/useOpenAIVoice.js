import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { auth } from "../services/firebase";

// Available OpenAI voices
export const OPENAI_VOICES = [
  { id: "alloy", name: "Alloy" },
  { id: "echo", name: "Echo" },
  { id: "fable", name: "Fable" },
  { id: "onyx", name: "Onyx" },
  { id: "nova", name: "Nova" },
  { id: "shimmer", name: "Shimmer" },
];

const TTS_API_URL = import.meta.env.VITE_TTS_API_URL;

if (!TTS_API_URL) {
  console.warn(
    "VITE_TTS_API_URL is not defined. TTS features will not work. Please set it in your .env.local file after deploying the TTS Cloud Function."
  );
}

/**
 * Custom hook for OpenAI Text-to-Speech via backend
 * Handles audio generation, playback, voice settings, and rate limiting
 */
export const useOpenAIVoice = () => {
  // State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voice, setVoice] = useState("nova");
  const [callsRemaining, setCallsRemaining] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  // Refs
  const audioRef = useRef(null);

  // Initialize Audio API on mount
  useEffect(() => {
    try {
      if (!TTS_API_URL) {
        setIsSupported(false);
        return;
      }

      // Create audio element
      audioRef.current = new Audio();

      // Load persisted settings from localStorage
      try {
        const savedSettings = localStorage.getItem("openaiVoiceSettings");
        if (savedSettings) {
          const { voice: savedVoice } = JSON.parse(savedSettings);
          if (savedVoice) setVoice(savedVoice);
        }
      } catch (error) {
        console.error("Error loading voice settings:", error);
      }

      setIsSupported(true);
    } catch (error) {
      console.error("OpenAI Voice API initialization error:", error);
      setIsSupported(false);
    }
  }, []);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("openaiVoiceSettings", JSON.stringify({ voice }));
    } catch (error) {
      console.error("Error saving voice settings:", error);
    }
  }, [voice]);

  /**
   * Call the TTS Cloud Function to generate audio
   * @param {string} text - Text to convert to speech
   * @returns {Promise<{audio: Blob, callsRemaining: number}>}
   */
  const generateAudio = useCallback(
    async (text) => {
      if (!auth.currentUser) {
        toast.error("Please log in to use text-to-speech");
        throw new Error("User not authenticated");
      }

      if (!TTS_API_URL) {
        toast.error("TTS service not configured. Please contact support.");
        throw new Error("TTS_API_URL not configured");
      }

      if (!text || text.trim().length === 0) {
        throw new Error("Text cannot be empty");
      }

      if (text.length > 4096) {
        toast.error("Text is too long (max 4096 characters)");
        throw new Error("Text exceeds maximum length");
      }

      setIsGenerating(true);

      try {
        const token = await auth.currentUser.getIdToken();

        const response = await fetch(TTS_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice,
            format: "mp3",
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          const errorMessage = data.error || `TTS Error: ${response.status}`;
          throw new Error(errorMessage);
        }

        // Update remaining calls
        if (data.callsRemaining !== undefined) {
          setCallsRemaining(data.callsRemaining);
          if (data.callsRemaining <= 10) {
            toast.warning(
              `Only ${data.callsRemaining} TTS calls remaining today`
            );
          }
        }

        // Convert base64 to Blob
        const binaryString = atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], {
          type: data.mimeType || "audio/mpeg",
        });

        return {
          audio: audioBlob,
          callsRemaining: data.callsRemaining,
        };
      } catch (error) {
        console.error("TTS Generation Error:", error);
        const errorMsg = error.message || "Failed to generate speech";
        toast.error(errorMsg);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    [voice]
  );

  /**
   * Speak the provided text
   * @param {string} text - Text to speak
   */
  const speak = useCallback(
    async (text) => {
      if (!audioRef.current) {
        toast.error("Audio not available");
        return;
      }

      try {
        const { audio } = await generateAudio(text);

        // Create object URL for audio blob
        const audioUrl = URL.createObjectURL(audio);
        audioRef.current.src = audioUrl;

        audioRef.current.onplay = () => {
          setIsSpeaking(true);
        };

        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };

        audioRef.current.onerror = () => {
          console.error("Audio playback error");
          toast.error("Error playing audio");
          setIsSpeaking(false);
        };

        audioRef.current.play().catch((error) => {
          console.error("Audio play error:", error);
          toast.error("Could not play audio");
          setIsSpeaking(false);
        });
      } catch (error) {
        console.error("Error in speak:", error);
        setIsSpeaking(false);
      }
    },
    [generateAudio]
  );

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Pause speaking
   */
  const pauseSpeaking = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  /**
   * Resume speaking
   */
  const resumeSpeaking = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.error("Resume audio error:", error);
      });
    }
  }, []);

  /**
   * Check if currently speaking
   */
  const isCurrentlySpeaking = useCallback(() => {
    return audioRef.current && !audioRef.current.paused;
  }, []);

  /**
   * Test voice with a sample sentence
   */
  const testVoice = useCallback(async () => {
    const testText = "Hello! This is a test of the text to speech voice.";
    await speak(testText);
  }, [speak]);

  return {
    // Playback control
    isSpeaking,
    isGenerating,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isCurrentlySpeaking,
    testVoice,

    // Settings
    voice,
    setVoice,
    callsRemaining,

    // Status
    isSupported,
    voices: OPENAI_VOICES,
  };
};
