// src/utils/arrayUtils.js (Create this new file)
/**
 * Rearranges the mainArray based on the order of IDs found in the priorityArray.
 * Elements with IDs in priorityArray come first, in that order, followed by remaining elements.
 * @param {Array<Object>} mainArray - The array of objects to be sorted (must have an 'id' property).
 * @param {Array<Object>} priorityArray - The array defining the priority order (must have an 'id' property).
 * @returns {Array<Object>} The rearranged array.
 */
export const rearrangeArrayById = (mainArray, priorityArray) => {
    if (!mainArray || !Array.isArray(mainArray) || !priorityArray || !Array.isArray(priorityArray)) {
      return mainArray || []; // Return original or empty array if inputs are invalid
    }
  
    const priorityIds = new Set(priorityArray.map(item => item.id));
    const mainMap = new Map(mainArray.map(item => [item.id, item]));
  
    const prioritized = priorityArray
      .map(priorityItem => mainMap.get(priorityItem.id))
      .filter(Boolean); // Filter out undefined if IDs don't match
  
    const remaining = mainArray.filter(mainItem => !priorityIds.has(mainItem.id));
  
    return [...prioritized, ...remaining];
  };
  
  // src/utils/timeUtils.js (Create this new file)
  /**
   * Converts HH:MM:SS string or a number (already seconds) to total seconds.
   * Returns a default value (e.g., 0) if input is invalid.
   * @param {string | number | null | undefined} timeInput - Time string (HH:MM:SS) or number of seconds.
   * @param {number} defaultSeconds - Default value if conversion fails.
   * @returns {number} Total seconds.
   */
  export const timeToSeconds = (timeInput, defaultSeconds = 0) => {
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