  // src/utils/timeUtils.js (Create this new file)
  /**
   * Converts HH:MM:SS string or a number (already seconds) to total seconds.
   * Returns a default value (e.g., 0) if input is invalid.
   * @param {string | number | null | undefined} timeInput - Time string (HH:MM:SS) or number of seconds.
   * @param {number} defaultSeconds - Default value if conversion fails.
   * @returns {number} Total seconds.
   */
const timeToSeconds = (timeInput, defaultSeconds = 0) => {
    if (typeof timeInput === 'number') {
      return timeInput >= 0 ? timeInput : defaultSeconds;
    }
    if (typeof timeInput === 'string' && timeInput.includes(':')) {
      const parts = timeInput.split(':').map(Number);
      if (parts.length === 3 && parts.every(num => !isNaN(num))) {
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
      }
    }
    return defaultSeconds;
  };

export default timeToSeconds;