/**
 * Date Validation Utilities
 * Provides clean, reusable validation functions for date constraints
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
 * @param {string} dateString - Date in YYYY-MM-DD format or ISO format
 * @returns {boolean} true if date is in future, false otherwise
 */
export const isFutureDate = (dateString) => {
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
 * Check if a date is realistic (not in far past, not before a reasonable year)
 * NOW INCLUDES STRICT FUTURE DATE CHECK
 * @param {string} dateString - Date in YYYY-MM-DD format or ISO format
 * @param {number} minYear - Minimum acceptable year (default: 1900)
 * @returns {object} { valid: boolean, error: string | null }
 */
export const isRealisticDate = (dateString, minYear = 1900) => {
  if (!dateString) {
    return { valid: false, error: 'Date is required.' };
  }

  try {
    const date = normalizeDate(dateString);
    const today = getTodayNormalized();
    const year = date.getFullYear();

    if (isNaN(year)) {
      return { valid: false, error: 'Invalid date format.' };
    }

    if (year < minYear) {
      return { valid: false, error: `Date cannot be before ${minYear}.` };
    }

    // STRICT: No future dates allowed
    if (date > today) {
      return { valid: false, error: 'Date cannot be in the future.' };
    }

    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: 'Invalid date.' };
  }
};

/**
 * Check if start date is before end date
 * INCLUDES STRICT FUTURE DATE CHECKS
 * @param {string} startDateString - Start date in YYYY-MM-DD format
 * @param {string} endDateString - End date in YYYY-MM-DD format
 * @returns {object} { valid: boolean, error: string | null }
 */
export const isStartBeforeEnd = (startDateString, endDateString) => {
  if (!startDateString || !endDateString) {
    return { valid: false, error: 'Both start and end dates are required.' };
  }

  try {
    const startDate = normalizeDate(startDateString);
    const endDate = normalizeDate(endDateString);
    const today = getTodayNormalized();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { valid: false, error: 'Invalid date format.' };
    }

    // Check if start date is in future
    if (startDate > today) {
      return { valid: false, error: 'Start date cannot be in the future.' };
    }

    // Check if end date is in future
    if (endDate > today) {
      return { valid: false, error: 'End date cannot be in the future.' };
    }

    // Check if start is before end
    if (startDate >= endDate) {
      return { valid: false, error: 'Start date must be before end date.' };
    }

    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: 'Invalid date comparison.' };
  }
};

/**
 * Check if a year is realistic (between minYear and current year)
 * @param {number|string} year - Year as number or string
 * @param {number} minYear - Minimum acceptable year (default: 1900)
 * @returns {object} { valid: boolean, error: string | null }
 */
export const isRealisticYear = (year, minYear = 1900) => {
  if (!year) {
    return { valid: false, error: 'Year is required.' };
  }

  try {
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear();

    if (isNaN(yearNum)) {
      return { valid: false, error: 'Invalid year.' };
    }

    if (yearNum < minYear) {
      return { valid: false, error: `Year cannot be before ${minYear}.` };
    }

    // STRICT: No future years allowed
    if (yearNum > currentYear) {
      return { valid: false, error: `Year cannot be after ${currentYear}.` };
    }

    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: 'Invalid year.' };
  }
};

/**
 * Check if end date is optional but if provided, must be after start date
 * INCLUDES STRICT FUTURE DATE CHECKS
 * @param {string} startDateString - Start date in YYYY-MM-DD format
 * @param {string} endDateString - End date in YYYY-MM-DD format (can be empty for ongoing)
 * @returns {object} { valid: boolean, error: string | null }
 */
export const isStartBeforeEndOrOngoing = (startDateString, endDateString) => {
  if (!startDateString) {
    return { valid: false, error: 'Start date is required.' };
  }

  try {
    const startDate = normalizeDate(startDateString);
    const today = getTodayNormalized();

    if (isNaN(startDate.getTime())) {
      return { valid: false, error: 'Invalid start date format.' };
    }

    // Check if start date is in future
    if (startDate > today) {
      return { valid: false, error: 'Start date cannot be in the future.' };
    }

    // If end date is not provided, it's considered ongoing - which is valid
    if (!endDateString) {
      return { valid: true, error: null };
    }

    try {
      const endDate = normalizeDate(endDateString);

      if (isNaN(endDate.getTime())) {
        return { valid: false, error: 'Invalid end date format.' };
      }

      // Check if end date is in future
      if (endDate > today) {
        return { valid: false, error: 'End date cannot be in the future.' };
      }

      // Check if start is before end
      if (startDate >= endDate) {
        return { valid: false, error: 'Start date must be before end date.' };
      }

      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: 'Invalid end date.' };
    }
  } catch (e) {
    return { valid: false, error: 'Invalid date comparison.' };
  }
};
