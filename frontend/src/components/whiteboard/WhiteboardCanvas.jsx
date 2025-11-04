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

  // Initialize canvas and set ref
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();

      // Set canvas resolution to match display size
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Set default canvas style
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      setCanvasRef(canvas);

      // Redraw existing history on mount
      if (drawingHistory.length > 0) {
        redrawCanvas(ctx);
      }
    }

    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;

        // Store current canvas content
        const imageData = canvas
          .getContext("2d")
          .getImageData(0, 0, oldWidth, oldHeight);

        // Resize
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Restore content and redraw
        const ctx = canvas.getContext("2d");
        ctx.putImageData(imageData, 0, 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const redrawCanvas = (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawingHistory.forEach((action) => {
      ctx.strokeStyle = action.strokeStyle || "#000000";
      ctx.lineWidth = action.lineWidth || 2;
      ctx.fillStyle = action.fillStyle || "#000000";
      ctx.globalCompositeOperation =
        action.globalCompositeOperation || "source-over";

      if (action.type === "stroke") {
        ctx.beginPath();
        ctx.moveTo(action.startX, action.startY);
        ctx.lineTo(action.endX, action.endY);
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

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click

    const pos = getCanvasCoordinates(e);
    setStartPos(pos);
    setIsDrawing(true);

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

    if (selectedTool === "pen") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = "source-over";
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    } else if (selectedTool === "eraser") {
      ctx.clearRect(currentPos.x - 5, currentPos.y - 5, 10, 10);
    } else if (
      selectedTool === "line" ||
      selectedTool === "circle" ||
      selectedTool === "rectangle"
    ) {
      // Draw preview for shapes
      setPreview({ current: currentPos });
      redrawCanvas(ctx);

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

    if (selectedTool === "pen" || selectedTool === "eraser") {
      addToHistory({
        type: "stroke",
        startX: startPos.x,
        startY: startPos.y,
        endX: currentPos.x,
        endY: currentPos.y,
        strokeStyle: selectedTool === "pen" ? "#000000" : null,
        lineWidth: 2,
        globalCompositeOperation:
          selectedTool === "eraser" ? "destination-out" : "source-over",
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
      className={`w-full bg-white cursor-crosshair touch-none`}
      style={{ height, display: "block" }}
    />
  );
};

export default WhiteboardCanvas;
