export const NewPerson = ({
  newName,
  handleOnChangeName,
  newPhone,
  handleOnChangePhone,
  handleOnSubmit,
}) => {
  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div>
          name: <input type="text" name="name" value={newName} onChange={handleOnChangeName} />
        </div>
        <div>
          phone number:{' '}
          <input type="tel" name="phone" value={newPhone} onChange={handleOnChangePhone} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};
