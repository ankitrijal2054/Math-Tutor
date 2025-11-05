import React, { useRef, useEffect, useState } from "react";
import { useWhiteboard } from "../../contexts/WhiteboardContext";

const WhiteboardCanvas = ({ height = "80%" }) => {
  const canvasRef = useRef(null);
  const {
    selectedTool,
    setCanvasRef,
    addToHistory,
    drawingHistory,
    setDrawingHistory,
  } = useWhiteboard();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState(null);
  const [currentStroke, setCurrentStroke] = useState([]); // Track all points in current stroke

  // Initialize canvas and set ref
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();

      // Get device pixel ratio for proper scaling (important for iPad Retina)
      const dpr = window.devicePixelRatio || 1;

      // Set canvas internal resolution (accounting for device pixel ratio)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale the canvas back down to CSS size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);

      // Set default canvas style
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      setCanvasRef(canvas);

      // Redraw existing history on mount
      if (drawingHistory.length > 0) {
        redrawCanvas(ctx, rect.width, rect.height, dpr);
      }
    }

    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Store current canvas content
        const ctx = canvas.getContext("2d");
        const oldWidth = rect.width;
        const oldHeight = rect.height;
        const imageData = ctx.getImageData(0, 0, oldWidth, oldHeight);

        // Resize with device pixel ratio
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);

        // Restore content and redraw
        ctx.putImageData(imageData, 0, 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Watch drawingHistory and redraw canvas when it changes (for undo/redo)
  useEffect(() => {
    if (canvasRef.current && drawingHistory !== undefined) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (drawingHistory.length > 0) {
        redrawCanvas(ctx, rect.width, rect.height, dpr);
      }
    }
  }, [drawingHistory]);

  const redrawCanvas = (ctx, canvasWidth, canvasHeight, dpr = 1) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawingHistory.forEach((action) => {
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

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Handle both mouse and touch events
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.clientX !== undefined) {
      // Mouse or pointer event
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0 && e.button !== undefined) return; // Only left click or touch

    const pos = getCanvasCoordinates(e);
    setStartPos(pos);
    setIsDrawing(true);
    setCurrentStroke([pos]); // Start new stroke with initial point

    if (selectedTool === "pen" || selectedTool === "eraser") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const currentPos = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (selectedTool === "pen") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
      // Add point to current stroke
      setCurrentStroke((prev) => [...prev, currentPos]);
    } else if (selectedTool === "eraser") {
      const eraserSize = 10;
      ctx.clearRect(
        currentPos.x - eraserSize / 2,
        currentPos.y - eraserSize / 2,
        eraserSize,
        eraserSize
      );
      // Add point to current stroke
      setCurrentStroke((prev) => [...prev, currentPos]);
    } else if (
      selectedTool === "line" ||
      selectedTool === "circle" ||
      selectedTool === "rectangle"
    ) {
      // Draw preview for shapes
      setPreview({ current: currentPos });
      redrawCanvas(ctx, rect.width, rect.height);

      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = "source-over";

      if (selectedTool === "line") {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
      } else if (selectedTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(currentPos.x - startPos.x, 2) +
            Math.pow(currentPos.y - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (selectedTool === "rectangle") {
        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    const currentPos = getCanvasCoordinates(e);
    const ctx = canvasRef.current.getContext("2d");

    if (selectedTool === "pen") {
      // Record complete stroke with all points
      addToHistory({
        type: "stroke",
        points: currentStroke,
        strokeStyle: "#000000",
        lineWidth: 2,
        globalCompositeOperation: "source-over",
      });
    } else if (selectedTool === "eraser") {
      // Record eraser stroke with all points
      addToHistory({
        type: "eraser_stroke",
        points: currentStroke,
        eraserSize: 10,
        globalCompositeOperation: "destination-out",
      });
    } else if (selectedTool === "line") {
      addToHistory({
        type: "line",
        startX: startPos.x,
        startY: startPos.y,
        endX: currentPos.x,
        endY: currentPos.y,
        strokeStyle: "#000000",
        lineWidth: 2,
      });
    } else if (selectedTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentPos.x - startPos.x, 2) +
          Math.pow(currentPos.y - startPos.y, 2)
      );
      addToHistory({
        type: "circle",
        centerX: startPos.x,
        centerY: startPos.y,
        radius,
        strokeStyle: "#000000",
        lineWidth: 2,
      });
    } else if (selectedTool === "rectangle") {
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      addToHistory({
        type: "rectangle",
        startX: startPos.x,
        startY: startPos.y,
        width,
        height,
        strokeStyle: "#000000",
        lineWidth: 2,
      });
    }

    setIsDrawing(false);
    setPreview(null);
    setCurrentStroke([]);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMouseMove(e);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp(e);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`w-full bg-white cursor-crosshair touch-none select-none block`}
      style={{
        height,
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      }}
    />
  );
};

export default WhiteboardCanvas;
