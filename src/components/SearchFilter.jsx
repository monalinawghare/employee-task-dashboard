/**
 * SearchFilter
 * Controlled search box + filter chip group, used on the Task List page.
 * Stays "dumb" (no internal state) - the parent owns searchTerm/filter
 * so that search and filter can be combined in one place.
 */
function SearchFilter({ searchTerm, onSearchChange, activeFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'All Tasks' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
    { key: 'high', label: 'High Priority' },
  ];

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrap">
        <span className="search-input-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks by title"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-chip-group" role="group" aria-label="Filter tasks">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`filter-chip${activeFilter === filter.key ? ' active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
            aria-pressed={activeFilter === filter.key}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchFilter;
