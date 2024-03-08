export const Search = ({ handleOnChangeSearch, searchInput }) => {
  return (
    <div>
      search by name:{' '}
      <input type="text" name="name" value={searchInput} onChange={handleOnChangeSearch} />
    </div>
  );
};
