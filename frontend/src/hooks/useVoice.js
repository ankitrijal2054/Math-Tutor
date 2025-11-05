import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";

// Browser compatibility check
const getSpeechRecognitionAPI = () => {
  if (typeof window === "undefined") return null;
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  return SpeechRecognition;
};

const getSpeechSynthesisAPI = () => {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis;
};

export const useVoice = () => {
  // State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [language, setLanguage] = useState("en-US");
  const [speechRate, setSpeechRate] = useState(1);
  const [volume, setVolume] = useState(1);

  // Refs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const utteranceRef = useRef(null);

  // Initialize APIs on mount
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionAPI();
    const SpeechSynthesis = getSpeechSynthesisAPI();

    if (!SpeechRecognition || !SpeechSynthesis) {
      setIsSupported(false);
      return;
    }

    // Load persisted settings from localStorage
    try {
      const savedSettings = localStorage.getItem("voiceSettings");
      if (savedSettings) {
        const {
          language: savedLang,
          speechRate: savedRate,
          volume: savedVol,
        } = JSON.parse(savedSettings);
        setLanguage(savedLang || "en-US");
        setSpeechRate(savedRate || 1);
        setVolume(savedVol || 1);
      }
    } catch (error) {
      console.error("Error loading voice settings:", error);
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      synthesisRef.current = SpeechSynthesis;

      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      // Speech Recognition event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
        setInterimTranscript("");
      };

      recognitionRef.current.onresult = (event) => {
        let interimText = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalText += transcript + " ";
          } else {
            interimText += transcript;
          }
        }

        setInterimTranscript(interimText);
        setTranscript((prev) => prev + finalText);
      };

      recognitionRef.current.onerror = (event) => {
        let errorMessage = "Voice error occurred";

        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage = "No microphone found. Please check permissions.";
            break;
          case "network":
            errorMessage = "Network error. Please check your connection.";
            break;
          case "not-allowed":
            errorMessage =
              "Microphone permission denied. Please enable it in settings.";
            break;
          default:
            errorMessage = `Voice error: ${event.error}`;
        }

        toast.error(errorMessage);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      setIsSupported(true);
    } catch (error) {
      console.error("Voice API initialization error:", error);
      setIsSupported(false);
      toast.error("Voice features not available on this browser");
    }
  }, []);

  // Update language when changed
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Voice not available. Please refresh the page.");
      return;
    }

    try {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      toast.error("Could not start voice recording");
    }
  }, []);

  // Stop listening and return transcript
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      const finalTranscript = transcript + interimTranscript;
      setInterimTranscript("");
      return finalTranscript.trim();
    } catch (error) {
      console.error("Error stopping recognition:", error);
      return transcript.trim();
    }
  }, [transcript, interimTranscript]);

  // Speak text
  const speak = useCallback(
    (text) => {
      if (!synthesisRef.current) {
        toast.error("Text-to-speech not available");
        return;
      }

      // Cancel any ongoing speech
      if (utteranceRef.current) {
        synthesisRef.current.cancel();
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechRate;
        utterance.volume = volume;
        utterance.lang = language;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          toast.error("Text-to-speech error occurred");
          setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        synthesisRef.current.speak(utterance);
      } catch (error) {
        console.error("Error speaking:", error);
        toast.error("Could not play audio");
      }
    },
    [speechRate, volume, language]
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Pause speaking
  const pauseSpeaking = useCallback(() => {
    if (synthesisRef.current && synthesisRef.current.paused === false) {
      synthesisRef.current.pause();
    }
  }, []);

  // Resume speaking
  const resumeSpeaking = useCallback(() => {
    if (synthesisRef.current && synthesisRef.current.paused === true) {
      synthesisRef.current.resume();
    }
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  // Check if currently speaking
  const isCurrentlySpeaking = useCallback(() => {
    return synthesisRef.current ? synthesisRef.current.speaking : false;
  }, []);

  return {
    // Recognition
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,

    // Synthesis
    isSpeaking,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isCurrentlySpeaking,

    // Settings
    isSupported,
    language,
    setLanguage,
    speechRate,
    setSpeechRate,
    volume,
    setVolume,
  };
};
