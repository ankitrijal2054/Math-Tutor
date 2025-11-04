/**
 * Save scroll position for a conversation
 * @param {string} conversationId - The conversation ID
 * @param {number} scrollPosition - The scroll Y position
 */
export const saveScrollPosition = (conversationId, scrollPosition) => {
  if (!conversationId) return;
  const scrollMap = JSON.parse(
    sessionStorage.getItem("scrollPositions") || "{}"
  );
  scrollMap[conversationId] = scrollPosition;
  sessionStorage.setItem("scrollPositions", JSON.stringify(scrollMap));
};

/**
 * Retrieve scroll position for a conversation
 * @param {string} conversationId - The conversation ID
 * @returns {number} The saved scroll position (defaults to 0)
 */
export const getScrollPosition = (conversationId) => {
  if (!conversationId) return 0;
  const scrollMap = JSON.parse(
    sessionStorage.getItem("scrollPositions") || "{}"
  );
  return scrollMap[conversationId] || 0;
};

/**
 * Clear scroll position for a conversation
 * @param {string} conversationId - The conversation ID
 */
export const clearScrollPosition = (conversationId) => {
  if (!conversationId) return;
  const scrollMap = JSON.parse(
    sessionStorage.getItem("scrollPositions") || "{}"
  );
  delete scrollMap[conversationId];
  sessionStorage.setItem("scrollPositions", JSON.stringify(scrollMap));
};

/**
 * Format a timestamp as relative time (e.g., "2 min ago", "Yesterday")
 * @param {Timestamp|Date|number} timestamp - Firestore timestamp, Date object, or milliseconds
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  let date;

  // Handle Firestore Timestamp objects
  if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    return "";
  }

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than a minute
  if (diffMins < 1) {
    return "just now";
  }

  // Minutes
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }

  // Hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Days (within a week)
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  // Format as date (e.g., "Jan 15")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Check if a date is today
 * @param {Timestamp|Date|number} date - Date to check
 * @returns {boolean}
 */
const isToday = (timestamp) => {
  if (!timestamp) return false;

  let date;
  if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    return false;
  }

  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is yesterday
 * @param {Timestamp|Date|number} date - Date to check
 * @returns {boolean}
 */
const isYesterday = (timestamp) => {
  if (!timestamp) return false;

  let date;
  if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

/**
 * Check if a date is within this week (last 7 days, excluding today and yesterday)
 * @param {Timestamp|Date|number} date - Date to check
 * @returns {boolean}
 */
const isThisWeek = (timestamp) => {
  if (!timestamp) return false;

  let date;
  if (timestamp && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    return false;
  }

  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  return diffDays >= 2 && diffDays <= 7;
};

/**
 * Group conversations by date
 * @param {Array} conversations - Array of conversation objects
 * @returns {Object} Grouped conversations { today: [], yesterday: [], thisWeek: [], older: [] }
 */
export const groupConversationsByDate = (conversations = []) => {
  const grouped = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  conversations.forEach((conv) => {
    const updatedAt = conv.updatedAt;

    if (isToday(updatedAt)) {
      grouped.today.push(conv);
    } else if (isYesterday(updatedAt)) {
      grouped.yesterday.push(conv);
    } else if (isThisWeek(updatedAt)) {
      grouped.thisWeek.push(conv);
    } else {
      grouped.older.push(conv);
    }
  });

  return grouped;
};
