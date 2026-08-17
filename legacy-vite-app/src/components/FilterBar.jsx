import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

export default function FilterBar({
  searchPlaceholder = 'Search...',
  onSearch,
  filters = [],
  children,
}) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch?.('');
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearch}
          className="filter-search-input"
        />
        {searchValue && (
          <button className="clear-search" onClick={clearSearch}>
            <X size={16} />
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filter</span>
        </button>
      )}

      {children && <div className="filter-bar-actions">{children}</div>}

      {showFilters && filters.length > 0 && (
        <div className="filter-bar-dropdown">
          {filters.map((filter) => (
            <div key={filter.key} className="filter-group">
              <label>{filter.label}</label>
              <select
                value={filter.value || ''}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}