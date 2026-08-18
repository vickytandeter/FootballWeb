import { useState } from "react";
import "../estilo/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="searchbar">
      <div className="searchbar-input-wrapper">
        <span className="searchbar-icon">🔍</span>
        <input
          type="text"
          className="searchbar-input"
          placeholder="Buscar por equipo o liga..."
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button className="searchbar-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;