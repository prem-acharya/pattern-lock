"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface PatternLockProps {
  pattern?: number[];
  onPatternComplete?: (pattern: number[]) => void;
  onPatternChange?: (pattern: number[]) => void;
  dotSize?: number;
  lineWidth?: number;
  className?: string;
  disabled?: boolean;
}

interface Point {
  x: number;
  y: number;
}

function isPointInDot(
  point: Point | null,
  dot: Point,
  radius: number
): boolean {
  if (!point) return false;
  const distance = Math.sqrt((point.x - dot.x) ** 2 + (point.y - dot.y) ** 2);
  return distance <= radius;
}

function getPointFromEvent(
  event: React.MouseEvent | React.TouchEvent,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): Point {
  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  if ("touches" in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  } else {
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }
}

function handleKeyDown(
  event: React.KeyboardEvent,
  onPatternChange?: (pattern: number[]) => void
) {
  if (event.key === "Escape" || event.key === "Delete") {
    onPatternChange?.([]);
  }
}

export function PatternLock({
  pattern = [],
  onPatternComplete,
  onPatternChange,
  dotSize = 20,
  lineWidth = 4,
  className,
  disabled = false,
}: PatternLockProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentPoint, setCurrentPoint] = React.useState<Point | null>(null);
  const [size, setSize] = React.useState(300);
  const { resolvedTheme } = useTheme();
  const [isHoveringDot, setIsHoveringDot] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  // Use a safe theme value that defaults to light
  const safeTheme = mounted ? resolvedTheme : "light";

  React.useEffect(() => {
    setMounted(true);
    function updateSize() {
      if (typeof window !== "undefined" && window.innerWidth < 640) {
        setSize(250);
      } else {
        setSize(300);
      }
    }
    updateSize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const dots = React.useMemo(() => {
    const dotsArray: Point[] = [];
    const spacing = size / 4;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        dotsArray.push({
          x: spacing + col * spacing,
          y: spacing + row * spacing,
        });
      }
    }
    return dotsArray;
  }, [size]);

  const drawCanvas = React.useCallback(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    if (pattern.length > 1) {
      let lineColor = "#000";
      if (safeTheme === "dark") {
        lineColor = "#fff";
      }
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(dots[pattern[0]].x, dots[pattern[0]].y);
      for (let i = 1; i < pattern.length; i++) {
        ctx.lineTo(dots[pattern[i]].x, dots[pattern[i]].y);
      }
      if (isDrawing && currentPoint) {
        ctx.lineTo(currentPoint.x, currentPoint.y);
      }
      ctx.stroke();
    }
    dots.forEach((dot, index) => {
      const isSelected = pattern.includes(index);
      const isActive =
        isSelected || (isDrawing && isPointInDot(currentPoint, dot, dotSize));
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dotSize / 2, 0, 2 * Math.PI);
      let dotColor = "#000";
      if (safeTheme === "dark") {
        dotColor = "#fff";
      }
      if (isActive) {
        ctx.fillStyle = "hsl(var(--primary))";
        ctx.fill();
        ctx.strokeStyle = "hsl(var(--primary-foreground))";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.strokeStyle = "hsl(var(--border))";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [
    mounted,
    pattern,
    isDrawing,
    currentPoint,
    dots,
    size,
    dotSize,
    lineWidth,
    safeTheme,
  ]);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    event.preventDefault();
    const point = getPointFromEvent(event, canvasRef);
    setCurrentPoint(point);
    const dotIndex = dots.findIndex((dot) => isPointInDot(point, dot, dotSize));
    if (dotIndex !== -1 && !pattern.includes(dotIndex)) {
      const newPattern = [...pattern, dotIndex];
      onPatternChange?.(newPattern);
    }
  };

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && !disabled && "clientX" in event) {
      const point = getPointFromEvent(event, canvasRef);
      const overDot = dots.some((dot) => isPointInDot(point, dot, dotSize));
      setIsHoveringDot(overDot);
    }
    handleMove(event);
  };

  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    event.preventDefault();
    const point = getPointFromEvent(event, canvasRef);
    setIsDrawing(true);
    setCurrentPoint(point);
    const dotIndex = dots.findIndex((dot) => isPointInDot(point, dot, dotSize));
    if (dotIndex !== -1) {
      const newPattern = [dotIndex];
      onPatternChange?.(newPattern);
    }
  };

  const handleEnd = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    event.preventDefault();
    setIsDrawing(false);
    setCurrentPoint(null);
    if (pattern.length > 0) {
      onPatternComplete?.(pattern);
    }
  };

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return (
      <div
        className={cn("relative inline-block", className)}
        style={{ width: size, height: size }}
      >
        <div
          className="border border-border rounded-lg bg-background flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      role="application"
      aria-label="Pattern lock interface"
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e, onPatternChange)}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={cn(
          "border border-border rounded-lg bg-background touch-none",
          disabled && "opacity-50 cursor-not-allowed",
          isHoveringDot ? "cursor-pointer" : "cursor-default"
        )}
        onMouseDown={handleStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={(e) => {
          setIsHoveringDot(false);
          handleEnd(e);
        }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        aria-label="Pattern lock grid - draw a pattern by connecting dots"
      />
    </div>
  );
}
