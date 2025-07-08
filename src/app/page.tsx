"use client";

import { allDocs } from "contentlayer/generated";
import * as React from "react";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import PatternLockDemo from "@/components/pattern-lock-demo";
import { mdxComponents } from "@/components/mdx-components";
import { CodeBlock } from "@/components/code-block";

export default function Home() {
  const doc = allDocs[0];

  const renderDocumentation = () => {
    if (!doc?.body?.raw) return <div>No documentation available</div>;

    const content = doc.body.raw;
    const lines = content.split("\n");
    const elements = [];
    let currentSection: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeContent: string[] = [];
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // Parse filename from codeLanguage if it exists
          const parseCodeHeader = (header: string) => {
            const parts = header.split(" ");
            const language = parts[0] || "text";
            const filenamePart = parts.find((part) =>
              part.startsWith("filename=")
            );
            let filename = "";

            if (filenamePart) {
              filename = filenamePart
                .replace("filename=", "")
                .replace(/["']/g, "");
            } else {
              // Fallback to language-based filename
              switch (language.toLowerCase()) {
                case "tsx":
                case "jsx":
                  filename = "component.tsx";
                  break;
                case "ts":
                  filename = "types.ts";
                  break;
                case "js":
                  filename = "script.js";
                  break;
                case "bash":
                case "sh":
                  filename = "terminal";
                  break;
                case "json":
                  filename = "config.json";
                  break;
                case "css":
                  filename = "styles.css";
                  break;
                default:
                  filename = "code";
              }
            }

            return { language, filename };
          };

          const { language, filename } = parseCodeHeader(codeLanguage);

          elements.push(
            <CodeBlock
              key={`code-${index}`}
              language={language}
              filename={filename}
              code={codeContent.join("\n")}
            />
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          codeLanguage = line.replace("```", "").trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Handle headers using MDX components
      if (line.startsWith("### ")) {
        const H3 = mdxComponents.h3;
        elements.push(<H3 key={`h3-${index}`}>{line.replace("### ", "")}</H3>);
      } else if (line.startsWith("## ")) {
        const H2 = mdxComponents.h2;
        elements.push(<H2 key={`h2-${index}`}>{line.replace("## ", "")}</H2>);
      } else if (line.startsWith("# ")) {
        const H1 = mdxComponents.h1;
        elements.push(<H1 key={`h1-${index}`}>{line.replace("# ", "")}</H1>);
      } else if (line.startsWith("- ")) {
        // Handle list items
        const listText = line
          .replace("- ", "")
          .replace(/\*\*(.*?)\*\*/g, (match, p1) => p1);
        const Li = mdxComponents.li;
        currentSection.push(
          <Li key={`li-${index}`}>
            <span
              dangerouslySetInnerHTML={{
                __html: listText.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong>$1</strong>"
                ),
              }}
            />
          </Li>
        );
      } else if (line.startsWith("| ")) {
        if (!inTable) {
          inTable = true;
          tableHeaders = line
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim());
        } else if (line.includes("---")) {
          return;
        } else {
          const rowData = line
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim());
          tableRows.push(rowData);
        }
      } else if (line.trim() === "") {
        if (currentSection.length > 0) {
          const Ul = mdxComponents.ul;
          elements.push(<Ul key={`ul-${index}`}>{currentSection}</Ul>);
          currentSection = [];
        }

        if (inTable && tableRows.length > 0) {
          elements.push(
            <div
              key={`table-${index}`}
              className="my-6 overflow-x-auto border border-border rounded-lg"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    {tableHeaders.map((header, i) => (
                      <th
                        key={i}
                        className="border border-border p-3 text-left font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-muted/30">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`border border-border p-3 ${
                            cellIndex === 0 ||
                            cellIndex === 1 ||
                            cellIndex === 2
                              ? "font-mono text-sm"
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: cell
                              .replace(
                                /`([^`]+)`/g,
                                '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>'
                              )
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
          tableHeaders = [];
          tableRows = [];
        }
      } else if (line.trim() !== "") {
        const paragraphText = line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(
            /`(.*?)`/g,
            '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
          );
        const P = mdxComponents.p;
        elements.push(
          <P
            key={`p-${index}`}
            dangerouslySetInnerHTML={{ __html: paragraphText }}
          />
        );
      }
    });

    // Handle remaining list items
    if (currentSection.length > 0) {
      const Ul = mdxComponents.ul;
      elements.push(<Ul key="final-ul">{currentSection}</Ul>);
    }

    return <div className="space-y-4">{elements}</div>;
  };

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
              <p>
                {doc?.description ||
                  "Learn how to use the Pattern Lock component."}
              </p>
            </div>
            <div className="space-y-8 text-base leading-relaxed">
              {renderDocumentation()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
