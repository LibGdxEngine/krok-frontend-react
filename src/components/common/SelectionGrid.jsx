// src/components/common/SelectionGrid.jsx
import React from 'react';
// No PropTypes import needed
import CheckButton from '@/components/ui/CheckButton'; // Assuming CheckButton is moved

/**
 * 
 * Generates Tailwind grid column classes based on configuration.
 * Example config: { base: 2, sm: 3, md: 4, lg: 5 }
 * Output: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
 */
const getGridColumnClasses = (config) => {
  const defaultCols = 'grid-cols-2'; // Default if no config
  if (!config || typeof config !== 'object') return defaultCols;

  return Object.entries(config)
    .map(([breakpoint, cols]) => {
      const colCount = parseInt(cols, 10);
      if (isNaN(colCount) || colCount < 1) return null;
      
      
      if (breakpoint === 'base') {
        return `grid-cols-${colCount}`;
      }
      return `${breakpoint}:grid-cols-${colCount}`;
    })
    .filter(Boolean)
    .join(' ');
};

/**
 * A generic, responsive grid component for selecting one item from a list.
 * (JavaScript Only - No PropTypes)
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.items - Array of items to display. Each item must have at least `id` and `name` properties.
 * @param {string|number|null} props.selectedItemId - The ID of the currently selected item.
 * @param {function(string|number): void} props.onSelectItem - Callback function when an item is clicked, receives the item's ID.
 * @param {object} [props.gridColumnsConfig] - Configuration for responsive columns (e.g., { base: 2, sm: 3, lg: 4 }).
 * @param {React.ComponentType} [props.ItemComponent=CheckButton] - The component to render for each item. Must accept `text`, `isSelected`, `onClick`, and `key` props.
 * @param {string} [props.className] - Optional additional CSS classes for the grid container.
 * @param {string} [props.itemClassName] - Optional additional CSS classes for each item wrapper.
 */
const SelectionGrid = ({
  items = [],
  selectedItemId = null,
  onSelectItem,
  gridColumnsConfig = { base: 4, sm: 2, md: 4, lg: 4 }, // Default responsive columns
  ItemComponent = CheckButton,
  className = '',
  itemClassName = '',
}) => {
  if (!items || items.length === 0) {
    return null; // Or render a placeholder/message
  }

  const gridClasses = getGridColumnClasses(gridColumnsConfig);
  console.log(gridClasses);
  
  const gapClass = 'gap-2 sm:gap-4'; // Adjust gap as needed

  // Ensure onSelectItem is a function before using it
  const handleItemClick = (itemId) => {
    if (typeof onSelectItem === 'function') {
        onSelectItem(itemId);
    } else {
        console.warn('SelectionGrid: onSelectItem prop is not a function!');
    }
  }

  return (
    <div className={`grid ${gridClasses} ${gapClass} ${className}`}>
      {items.map((item) => (
        // Validate item structure minimally
        (item && item.id != null && item.name != null) ? (
            <div key={item.id} className={itemClassName}> {/* Key on the wrapper */}
                <ItemComponent
                    text={item.name}
                    isSelected={item.id === selectedItemId}
                    onClick={() => handleItemClick(item.id)}
                />
            </div>
        ) : (
           // Optionally render a placeholder for invalid items or log a warning
           console.warn('SelectionGrid: Skipping invalid item:', item),
           null
        )
      ))}
    </div>
  );
};

// PropTypes block is removed for JS-only environment

export default SelectionGrid;