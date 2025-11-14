/**
 * Date Checking Utilities for List Pages
 * Provides clean helpers to detect date issues in displayed records
 */

// Helper to normalize dates for comparison (ignoring time)
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Helper to get today's date normalized
const getTodayNormalized = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Check if a date is in the future
 * @param {string} dateString - Date string
 * @returns {boolean}
 */
export const isDateInFuture = (dateString) => {
  if (!dateString) return false;
  try {
    const date = normalizeDate(dateString);
    const today = getTodayNormalized();
    return date > today;
  } catch (e) {
    return false;
  }
};

/**
 * Check if end date is before start date
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {boolean}
 */
export const hasInvalidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  try {
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    return end < start;
  } catch (e) {
    return false;
  }
};

/**
 * Get date validation issues for a record
 * @param {object} record - Record with date fields
 * @param {object} dateFields - Object mapping field names: { start: 'StartDate', end: 'EndDate', single: 'ActivityDate' }
 * @returns {object} { hasIssue: boolean, issues: array of strings }
 */
export const getDateIssues = (record, dateFields = {}) => {
  const issues = [];

  const { start, end, single } = dateFields;

  // Check single date field (e.g., ActivityDate)
  if (single && record[single] && isDateInFuture(record[single])) {
    issues.push(`${single} is in the future`);
  }

  // Check start/end date range
  if (start && record[start]) {
    if (isDateInFuture(record[start])) {
      issues.push('Start date is in the future');
    }
  }

  if (end && record[end]) {
    if (isDateInFuture(record[end])) {
      issues.push('End date is in the future');
    }
  }

  // Check if range is invalid (end before start)
  if (start && end && record[start] && record[end]) {
    if (hasInvalidDateRange(record[start], record[end])) {
      issues.push('End date is before start date');
    }
  }

  return {
    hasIssue: issues.length > 0,
    issues
  };
};
