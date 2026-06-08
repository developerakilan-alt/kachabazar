/**
 * Validation Utilities
 *
 * Handles parsing API validation errors and mapping them to form fields
 * for proper field-level error display in the UI.
 */

/**
 * Parse validation errors from API response and map to form-friendly format
 *
 * Backend error format:
 * {
 *   message: "Validation failed",
 *   errors: [
 *     { field: "fieldName", message: "error message", value: "..." }
 *   ]
 * }
 *
 * @param {Object} err - Error object from API call
 * @returns {Object} - Object with { fieldErrors: {field: message}, generalError: string }
 */
export const parseApiValidationErrors = (err) => {
  const result = {
    fieldErrors: {},
    generalError: null,
    hasFieldErrors: false,
  };

  const response = err?.response?.data;

  if (!response) {
    result.generalError = err?.message || "An unexpected error occurred";
    return result;
  }

  // Handle validation errors array from express-validator
  if (response.errors && Array.isArray(response.errors)) {
    response.errors.forEach((error) => {
      const fieldName = error.field || error.path || error.param;
      if (fieldName) {
        result.fieldErrors[fieldName] = error.message || error.msg;
        result.hasFieldErrors = true;
      }
    });
  }

  // Set general error message
  result.generalError = response.message || err?.message || "An error occurred";

  return result;
};

/**
 * Set form errors from API validation response
 *
 * @param {Object} err - Error object from API call
 * @param {Function} setError - react-hook-form setError function
 * @param {Function} notifyError - Toast notification function for general errors
 */
export const handleApiValidationErrors = (err, setError, notifyError) => {
  const { fieldErrors, generalError, hasFieldErrors } =
    parseApiValidationErrors(err);

  // Debug logging
  console.log("API Validation Errors:", {
    fieldErrors,
    generalError,
    hasFieldErrors,
  });

  // Set field-level errors if available
  if (hasFieldErrors && setError) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      console.log(`Setting error for field "${field}": ${message}`);
      setError(field, {
        type: "server",
        message: message,
      });
    });
  }

  // Show toast notification
  if (notifyError) {
    if (hasFieldErrors) {
      // Show all field errors in the toast as well for visibility
      const errorList = Object.entries(fieldErrors)
        .map(([field, message]) => `${formatFieldName(field)}: ${message}`)
        .join(", ");
      notifyError(errorList || "Please fix the validation errors in the form");
    } else if (generalError) {
      notifyError(generalError);
    }
  }

  return { fieldErrors, generalError, hasFieldErrors };
};

/**
 * Format validation error message for display
 * Creates a more user-friendly error message from API error
 *
 * @param {Object} err - Error object from API call
 * @returns {string} - Formatted error message
 */
export const formatApiErrorMessage = (err) => {
  const { fieldErrors, generalError, hasFieldErrors } =
    parseApiValidationErrors(err);

  if (hasFieldErrors) {
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, message]) => `${formatFieldName(field)}: ${message}`)
      .join(", ");
    return `Validation failed: ${errorMessages}`;
  }

  return generalError;
};

/**
 * Convert field name to human-readable format
 * e.g., "originalPrice" -> "Original Price"
 *
 * @param {string} fieldName - The field name in camelCase
 * @returns {string} - Human-readable field name
 */
export const formatFieldName = (fieldName) => {
  if (!fieldName) return "";

  // Handle nested fields like "prices.originalPrice"
  const parts = fieldName.split(".");
  const lastPart = parts[parts.length - 1];

  // Convert camelCase to Title Case with spaces
  return lastPart
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Check if the error is a validation error (400 status)
 *
 * @param {Object} err - Error object from API call
 * @returns {boolean}
 */
export const isValidationError = (err) => {
  return err?.response?.status === 400 && err?.response?.data?.errors;
};

/**
 * Get all error messages as an array (for displaying in a list)
 *
 * @param {Object} err - Error object from API call
 * @returns {string[]} - Array of error messages
 */
export const getErrorMessages = (err) => {
  const { fieldErrors, generalError, hasFieldErrors } =
    parseApiValidationErrors(err);

  const messages = [];

  if (hasFieldErrors) {
    Object.entries(fieldErrors).forEach(([field, message]) => {
      messages.push(`${formatFieldName(field)}: ${message}`);
    });
  } else if (generalError) {
    messages.push(generalError);
  }

  return messages;
};
