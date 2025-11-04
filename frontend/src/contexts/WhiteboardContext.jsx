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
  // Initialize selectedTool from sessionStorage or default to "pen"
  const [selectedTool, setSelectedTool] = useState(() => {
    const saved = sessionStorage.getItem("whiteboardTool");
    return saved || "pen";
  });
  const [canvasRef, setCanvasRef] = useState(null);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]); // Stack for redo
  const [captionText, setCaptionText] = useState("");

  // Persist selected tool to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("whiteboardTool", selectedTool);
  }, [selectedTool]);

  const openWhiteboard = useCallback(() => {
    setIsWhiteboardOpen(true);
  }, []);

  const closeWhiteboard = useCallback(() => {
    setIsWhiteboardOpen(false);
  }, []);

  const clearWhiteboard = useCallback(() => {
    setDrawingHistory([]);
    setRedoHistory([]);
    setCaptionText("");
    // Canvas will be cleared by WhiteboardCanvas useEffect watching drawingHistory
  }, []);

  const undo = useCallback(() => {
    if (drawingHistory.length > 0) {
      const newHistory = [...drawingHistory];
      const lastAction = newHistory.pop();

      // Add to redo stack
      setRedoHistory((prev) => [...prev, lastAction]);
      setDrawingHistory(newHistory);
      // Canvas will be redrawn by WhiteboardCanvas useEffect watching drawingHistory
    }
  }, [drawingHistory, canvasRef]);

  const redo = useCallback(() => {
    if (redoHistory.length > 0) {
      const newRedoHistory = [...redoHistory];
      const actionToRedo = newRedoHistory.pop();

      // Add back to drawing history
      const newHistory = [...drawingHistory, actionToRedo];
      setRedoHistory(newRedoHistory);
      setDrawingHistory(newHistory);
      // Canvas will be redrawn by WhiteboardCanvas useEffect watching drawingHistory
    }
  }, [drawingHistory, redoHistory, canvasRef]);

  const redrawCanvas = (ctx, history) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    history.forEach((action) => {
      ctx.strokeStyle = action.strokeStyle || "#000000";
      ctx.lineWidth = action.lineWidth || 2;
      ctx.fillStyle = action.fillStyle || "#000000";
      ctx.globalCompositeOperation =
        action.globalCompositeOperation || "source-over";

      if (action.type === "stroke") {
        // Draw smooth stroke from points array
        if (action.points && action.points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(action.points[0].x, action.points[0].y);
          for (let i = 1; i < action.points.length; i++) {
            ctx.lineTo(action.points[i].x, action.points[i].y);
          }
          ctx.stroke();
        }
      } else if (action.type === "eraser_stroke") {
        // Redraw eraser strokes using clearRect along the path
        if (action.points && action.points.length > 0) {
          for (let i = 0; i < action.points.length; i++) {
            ctx.clearRect(
              action.points[i].x - action.eraserSize / 2,
              action.points[i].y - action.eraserSize / 2,
              action.eraserSize,
              action.eraserSize
            );
          }
        }
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
    // Clear redo history when new action is added
    setRedoHistory([]);
  }, []);

  // Keyboard shortcuts for undo (Ctrl+Z or Cmd+Z) and redo (Ctrl+Shift+Z or Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isWhiteboardOpen && (e.ctrlKey || e.metaKey)) {
        if (e.key === "z") {
          if (e.shiftKey) {
            e.preventDefault();
            redo();
          } else {
            e.preventDefault();
            undo();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWhiteboardOpen, undo, redo]);

  const value = {
    isWhiteboardOpen,
    selectedTool,
    canvasRef,
    drawingHistory,
    redoHistory,
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
    redo,
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
