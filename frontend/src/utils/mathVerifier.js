/**
 * Math Verification Utility
 * Detects and extracts verification tags from AI responses
 * Tags: [ANSWER_VERIFIED_CORRECT], [ANSWER_NEEDS_REVIEW]
 */

/**
 * Extract verification tags from AI response text
 * @param {string} text - The AI response text
 * @returns {Object} - { hasTag: boolean, tagType: string, cleanText: string }
 */
export const extractVerificationTag = (text) => {
  if (!text || typeof text !== "string") {
    return {
      hasTag: false,
      tagType: null,
      cleanText: text,
    };
  }

  // Check for verification tags
  const correctMatch = text.match(/\[ANSWER_VERIFIED_CORRECT\]/);
  const reviewMatch = text.match(/\[ANSWER_NEEDS_REVIEW\]/);

  if (correctMatch) {
    return {
      hasTag: true,
      tagType: "CORRECT",
      cleanText: text.replace(/\s*\[ANSWER_VERIFIED_CORRECT\]\s*$/, "").trim(),
    };
  }

  if (reviewMatch) {
    return {
      hasTag: true,
      tagType: "NEEDS_REVIEW",
      cleanText: text.replace(/\s*\[ANSWER_NEEDS_REVIEW\]\s*$/, "").trim(),
    };
  }

  return {
    hasTag: false,
    tagType: null,
    cleanText: text,
  };
};

/**
 * Check if an answer is verified as correct
 * @param {string} text - The AI response text
 * @returns {boolean} - True if answer is verified correct
 */
export const isAnswerCorrect = (text) => {
  const verification = extractVerificationTag(text);
  return verification.tagType === "CORRECT";
};

/**
 * Check if an answer needs review
 * @param {string} text - The AI response text
 * @returns {boolean} - True if answer needs review
 */
export const isAnswerNeedsReview = (text) => {
  const verification = extractVerificationTag(text);
  return verification.tagType === "NEEDS_REVIEW";
};

/**
 * Get clean text without verification tags for display
 * @param {string} text - The AI response text
 * @returns {string} - Text without verification tags
 */
export const getCleanText = (text) => {
  const verification = extractVerificationTag(text);
  return verification.cleanText;
};
