// src/utils/arrayUtils.js (Create this new file)
/**
 * Rearranges the mainArray based on the order of IDs found in the priorityArray.
 * Elements with IDs in priorityArray come first, in that order, followed by remaining elements.
 * @param {Array<Object>} mainArray - The array of objects to be sorted (must have an 'id' property).
 * @param {Array<Object>} priorityArray - The array defining the priority order (must have an 'id' property).
 * @returns {Array<Object>} The rearranged array.
 */
const rearrangeArrayById = (mainArray, priorityArray) => {
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
  
export default rearrangeArrayById;
