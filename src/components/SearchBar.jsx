function SearchBar({ city, setCity, onSearch }) {
  return (
    <form className="search" onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;