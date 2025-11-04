import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const WhiteboardContext = createContext(null);

/**
 * WhiteboardProvider component that manages whiteboard state
 */
export const WhiteboardProvider = ({ children }) => {
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("pen"); // pen, eraser, line, circle, rectangle
  const [canvasRef, setCanvasRef] = useState(null);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [captionText, setCaptionText] = useState("");

  const openWhiteboard = useCallback(() => {
    setIsWhiteboardOpen(true);
  }, []);

  const closeWhiteboard = useCallback(() => {
    setIsWhiteboardOpen(false);
  }, []);

  const clearWhiteboard = useCallback(() => {
    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setDrawingHistory([]);
      setCaptionText("");
    }
  }, [canvasRef]);

  const undo = useCallback(() => {
    if (drawingHistory.length > 0) {
      const newHistory = [...drawingHistory];
      newHistory.pop();
      setDrawingHistory(newHistory);

      // Redraw canvas with remaining history
      if (canvasRef && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        redrawCanvas(ctx, newHistory);
      }
    }
  }, [drawingHistory, canvasRef]);

  const redrawCanvas = (ctx, history) => {
    history.forEach((action) => {
      ctx.strokeStyle = action.strokeStyle || "#000000";
      ctx.lineWidth = action.lineWidth || 2;
      ctx.fillStyle = action.fillStyle || "#000000";
      ctx.globalCompositeOperation =
        action.globalCompositeOperation || "source-over";

      if (action.type === "stroke") {
        ctx.beginPath();
        ctx.moveTo(action.startX, action.startY);
        ctx.lineTo(action.endX, action.endY);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      } else if (action.type === "line") {
        ctx.beginPath();
        ctx.moveTo(action.startX, action.startY);
        ctx.lineTo(action.endX, action.endY);
        ctx.stroke();
      } else if (action.type === "circle") {
        ctx.beginPath();
        ctx.arc(action.centerX, action.centerY, action.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (action.type === "rectangle") {
        ctx.strokeRect(
          action.startX,
          action.startY,
          action.width,
          action.height
        );
      }

      ctx.globalCompositeOperation = "source-over";
    });
  };

  const addToHistory = useCallback((action) => {
    setDrawingHistory((prev) => {
      const newHistory = [...prev, action];
      // Limit history to 50 actions to prevent memory issues
      return newHistory.slice(-50);
    });
  }, []);

  // Keyboard shortcut for undo (Ctrl+Z or Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWhiteboardOpen && (e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWhiteboardOpen, undo]);

  const value = {
    isWhiteboardOpen,
    selectedTool,
    canvasRef,
    drawingHistory,
    captionText,
    openWhiteboard,
    closeWhiteboard,
    clearWhiteboard,
    setSelectedTool,
    setCanvasRef,
    setDrawingHistory,
    setCaptionText,
    addToHistory,
    undo,
  };

  return (
    <WhiteboardContext.Provider value={value}>
      {children}
    </WhiteboardContext.Provider>
  );
};

/**
 * Hook to use WhiteboardContext
 */
export const useWhiteboard = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error("useWhiteboard must be used within WhiteboardProvider");
  }
  return context;
};

export default WhiteboardContext;
