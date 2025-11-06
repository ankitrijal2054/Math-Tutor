import React, { Fragment } from "react";
import { InlineMath, BlockMath } from "react-katex";

/**
 * MathRenderer Component
 * Parses text content for LaTeX delimiters ($...$ and $$...$$)
 * and renders them using KaTeX, while keeping regular text intact.
 */
const MathRenderer = ({ content }) => {
  if (!content) return null;

  // Parse content into text and math segments
  const segments = parseContent(content);

  return (
    <div className="w-full">
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <span key={index} className="inline">
              {segment.value}
            </span>
          );
        } else if (segment.type === "inline-math") {
          return (
            <span key={index} className="inline">
              <InlineMath math={segment.value} />
            </span>
          );
        } else if (segment.type === "block-math") {
          return (
            <div
              key={index}
              className="flex justify-center my-3 p-2 rounded-lg bg-slate-700 bg-opacity-20"
            >
              <BlockMath math={segment.value} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

/**
 * Parse content string into segments of text and math
 * Handles both inline ($...$, \(...\)) and block ($$...$$, \[...\]) math
 */
function parseContent(content) {
  const segments = [];
  let currentIndex = 0;

  // Regex to find block math ($$...$$, \[...\]) and inline math ($...$, \(...\))
  // Priority order: $$ > \[ > $ > \(
  const regex =
    /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^$\n]+?\$|\\`[^`]*?\\`|\\\([^\)]*?\\\))/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    // Add text before this match
    if (match.index > currentIndex) {
      segments.push({
        type: "text",
        value: content.substring(currentIndex, match.index),
      });
    }

    // Add the math segment
    const mathContent = match[0];
    if (mathContent.startsWith("$$")) {
      // Block math with $$: remove the $$ delimiters
      segments.push({
        type: "block-math",
        value: mathContent.slice(2, -2).trim(),
      });
    } else if (mathContent.startsWith("\\[")) {
      // Block math with \[...\]: remove the \[ and \] delimiters
      segments.push({
        type: "block-math",
        value: mathContent.slice(2, -2).trim(),
      });
    } else if (mathContent.startsWith("\\(")) {
      // Inline math with \(...\): remove the \( and \) delimiters
      segments.push({
        type: "inline-math",
        value: mathContent.slice(2, -2),
      });
    } else {
      // Inline math with $: remove the $ delimiters
      segments.push({
        type: "inline-math",
        value: mathContent.slice(1, -1),
      });
    }

    currentIndex = match.index + mathContent.length;
  }

  // Add remaining text
  if (currentIndex < content.length) {
    segments.push({
      type: "text",
      value: content.substring(currentIndex),
    });
  }

  return segments;
}

export default MathRenderer;
