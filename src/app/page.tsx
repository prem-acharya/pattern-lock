"use client";

import { allDocuments } from "contentlayer/generated";
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
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer/hooks";
import { CodeBlock } from "@/components/code-block";

export default function Home() {
  const [currentPattern, setCurrentPattern] = React.useState<number[]>([]);

  const handlePatternChange = (pattern: number[]) => {
    setCurrentPattern(pattern);
  };

  const handlePatternComplete = (pattern: number[]) => {
    // Remove all status message logic
  };

  const resetPattern = () => {
    setCurrentPattern([]);
  };

  const formatPattern = (pattern: number[]) => {
    if (pattern.length === 0) return "";
    return pattern.map((dot) => dot + 1).join("");
  };

  // Use the first snippet for documentation
  const doc = allDocuments[0];
  const MDXContent = useMDXComponent(doc.body.code);

  // Custom MDX components mapping
  const components = {
    pre: (props: any) => <div {...props} />, // Prevent double wrapping
    code: (props: any) => {
      const { className = "", children = "" } = props;
      const match = className.match(/language-(\w+)/);
      return (
        <CodeBlock
          language={match ? match[1] : ""}
          filename={""}
          code={
            typeof children === "string" ? children.trim() : String(children)
          }
        />
      );
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="absolute right-0 top-0 flex gap-2 items-center">
            <Link
              href="https://github.com/your-username/your-repo"
              target="_blank"
              className="text-sm font-medium hover:underline underline-offset-4"
              aria-label="View on GitHub"
            >
              Github
            </Link>
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight pt-12 md:pt-0">
            {doc.title}
          </h1>
          <p className="text-muted-foreground">{doc.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Pattern Lock Component */}
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
          {/* Documentation Section */}
          <div className="lg:col-span-2 h-[80vh] custom-scrollbar overflow-y-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight pt-12 md:pt-0">
                {doc.title}
              </h1>
              <p className="text-muted-foreground">{doc.description}</p>
            </div>
            <div className="space-y-8 text-base leading-relaxed">
              <MDXContent components={components} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
