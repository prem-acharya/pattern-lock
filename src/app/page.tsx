"use client";

import { allDocuments } from "contentlayer/generated";
import * as React from "react";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import PatternLockDemo from "@/components/pattern-lock-demo";
import { CodeBlock } from "@/components/code-block";

export default function Home() {
  // Use the first snippet for documentation
  const doc = allDocuments[0];
  
  // TODO: Re-enable MDX content when compatibility issues are resolved
  // const createFallbackComponent = (message: string) => {
  //   const FallbackComponent = () => <div>{message}</div>;
  //   FallbackComponent.displayName = `FallbackComponent_${message.replace(/\s/g, "")}`;
  //   return FallbackComponent;
  // };
  // 
  // const MDXContent = React.useMemo(() => {
  //   if (!doc?.body?.code) return createFallbackComponent("No content available");
  //   try {
  //     return getMDXComponent(doc.body.code);
  //   } catch (error) {
  //     console.error("Error loading MDX component:", error);
  //     return createFallbackComponent("Error loading content");
  //   }
  // }, [doc]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <div className="absolute right-0 top-0 flex gap-2 items-center">
            <Link
              href="https://github.com/prem-acharya/pattern-lock"
              target="_blank"
              className="text-sm font-medium hover:underline underline-offset-4"
              aria-label="View on GitHub"
            >
              Github
            </Link>
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight pt-12 md:pt-0">
            Pattern Lock
          </h1>
          <p className="text-muted-foreground">
            A customizable UI component for drawing patterns by connecting dots
            for authentication or creative input.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Pattern Lock Component */}
          <PatternLockDemo />
          {/* Documentation Section */}
          <div className="lg:col-span-2 h-[80vh] custom-scrollbar overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight pt-12 md:pt-0">
                {doc?.title || "Pattern Lock Documentation"}
              </h1>
              <p>{doc?.description || "Learn how to use the Pattern Lock component."}</p>
            </div>
            <div className="space-y-8 text-base leading-relaxed">
              {/* Features Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Click and drag to connect the dots and create a pattern.</li>
                  <li>Press the <strong>Reset</strong> button to clear the pattern.</li>
                  <li>The output below the lock shows the pattern as a sequence of numbers.</li>
                  <li>Fully responsive and works in both light and dark themes.</li>
                </ul>
              </div>
              
              {/* Usage Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Usage</h3>
                <CodeBlock
                  language="tsx"
                  filename=""
                  code={`import { PatternLock } from "@/components/pattern-lock";

<PatternLock
  pattern={pattern}
  onPatternChange={setPattern}
  dotSize={24}
  lineWidth={4}
/>`}
                />
              </div>
              
              {/* Props Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Props</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border p-2 text-left">Prop</th>
                        <th className="border border-border p-2 text-left">Type</th>
                        <th className="border border-border p-2 text-left">Default</th>
                        <th className="border border-border p-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">pattern</td>
                        <td className="border border-border p-2 font-mono text-sm">number[]</td>
                        <td className="border border-border p-2 font-mono text-sm">[]</td>
                        <td className="border border-border p-2">Current pattern as array of dot indices</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">onPatternChange</td>
                        <td className="border border-border p-2 font-mono text-sm">(pattern: number[]) =&gt; void</td>
                        <td className="border border-border p-2">-</td>
                        <td className="border border-border p-2">Callback when pattern changes</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">onPatternComplete</td>
                        <td className="border border-border p-2 font-mono text-sm">(pattern: number[]) =&gt; void</td>
                        <td className="border border-border p-2">-</td>
                        <td className="border border-border p-2">Callback when drawing is complete</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">dotSize</td>
                        <td className="border border-border p-2 font-mono text-sm">number</td>
                        <td className="border border-border p-2 font-mono text-sm">20</td>
                        <td className="border border-border p-2">Size of the dots in pixels</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">lineWidth</td>
                        <td className="border border-border p-2 font-mono text-sm">number</td>
                        <td className="border border-border p-2 font-mono text-sm">4</td>
                        <td className="border border-border p-2">Width of the connecting lines</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">className</td>
                        <td className="border border-border p-2 font-mono text-sm">string</td>
                        <td className="border border-border p-2">-</td>
                        <td className="border border-border p-2">Additional CSS classes</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-2 font-mono text-sm">disabled</td>
                        <td className="border border-border p-2 font-mono text-sm">boolean</td>
                        <td className="border border-border p-2 font-mono text-sm">false</td>
                        <td className="border border-border p-2">Whether the component is disabled</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Installation Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Installation</h3>
                <CodeBlock
                  language="bash"
                  filename=""
                  code="npm install next-themes lucide-react"
                />
                <p className="mt-4 text-muted-foreground">
                  Copy the component code from <code className="bg-muted px-1 py-0.5 rounded text-sm">src/components/pattern-lock.tsx</code> and ensure you have the required dependencies installed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
