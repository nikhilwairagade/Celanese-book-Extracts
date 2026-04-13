import React from 'react';

/**
 * ReadingTimeFilter — Min/max reading time range filter inputs.
 * Allows filtering books by their estimatedReadingTimeMinutes field.
 * Both fields are optional — leave empty to remove that bound.
 *
 * Props:
 *   @param {string}   minValue - Current minimum reading time ('' = no min)
 *   @param {string}   maxValue - Current maximum reading time ('' = no max)
 *   @param {Function} onChange - Callback to update filter state in parent hook
 */
function ReadingTimeFilter({ minValue, maxValue, onChange }) {
  return (
    <>
      <label>
        Min reading time
        <input
          type="number"
          name="minReadingTime"
          value={minValue}
          onChange={onChange}
          min="0"
          placeholder="0"
        />
      </label>

      <label>
        Max reading time
        <input
          type="number"
          name="maxReadingTime"
          value={maxValue}
          onChange={onChange}
          min="0"
          placeholder="60"
        />
      </label>
    </>
  );
}

export default ReadingTimeFilter;
