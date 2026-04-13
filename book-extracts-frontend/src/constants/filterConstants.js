/**
 * Filter Constants — Default state for all filter controls.
 *
 * initialFilters:
 *   Used to initialize filter state in useBooks hook and to reset
 *   all filters when the user clicks "Reset filters".
 *   Empty strings mean "no filter active" for that field.
 *
 * Fields:
 *   - author:               Empty = all authors shown (single-select dropdown)
 *   - minReadingTime:       Empty = no minimum limit
 *   - maxReadingTime:       Empty = no maximum limit
 *   - publicationDateFrom:  Empty = no start date bound
 *   - publicationDateTo:    Empty = no end date bound
 *   - publicationDateExact: Empty = no exact date filter
 */
export const initialFilters = {
  author: '',
  minReadingTime: '',
  maxReadingTime: '',
  publicationDateFrom: '',
  publicationDateTo: '',
  publicationDateExact: '',
};
