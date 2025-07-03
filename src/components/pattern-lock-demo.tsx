"use client";

import * as React from "react";
import { PatternLock } from "@/components/pattern-lock";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

const PatternLockDemo = () => {
  const [currentPattern, setCurrentPattern] = React.useState<number[]>([]);

  const handlePatternChange = (pattern: number[]) => {
    setCurrentPattern(pattern);
  };

  const handlePatternComplete = () => {
    // Remove all status message logic
  };

  const resetPattern = () => {
    setCurrentPattern([]);
  };

  const formatPattern = (pattern: number[]) => {
    if (pattern.length === 0) return "";
    return pattern.map((dot) => dot + 1).join("");
  };

  return (
    <div>
      <div className="lg:col-span-1">
        <Card className="flex flex-col items-center p-4 sticky top-8">
          <CardTitle>Pattern Lock</CardTitle>
          <CardDescription>
            Draw a pattern by connecting the dots
          </CardDescription>
          <CardContent className="space-y-4">
            <PatternLock
              pattern={currentPattern}
              onPatternChange={handlePatternChange}
              onPatternComplete={handlePatternComplete}
              dotSize={24}
              lineWidth={4}
            />
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetPattern}
                className="flex items-center gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            {/* Pattern Output */}
            <div className="text-center text-lg font-mono mt-2">
              Output: {`"${formatPattern(currentPattern)}"`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatternLockDemo;
