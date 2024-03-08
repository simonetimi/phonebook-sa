import { removeFromDb } from '../helpers/connect';

const DeleteButton = ({ personId, setPersons, persons, setNotification }) => {
  const handleOnClick = async () => {
    if (window.confirm('Do you really want to delete the entry?')) {
      try {
        await removeFromDb(personId);
        const updatedPersons = persons.filter((person) => person.id !== personId);
        setPersons(updatedPersons);
        setNotification({ type: 'success', message: `Contact deleted!` });
      } catch (error) {
        setNotification({ type: 'error', message: 'Error deleting contact!' });
      }
    }
  };
  return <button onClick={handleOnClick}>delete</button>;
};

export const ShowPeople = ({ searchInput, persons, found, setPersons, setNotification }) => {
  return searchInput === ''
    ? persons.map((person) => (
        <li key={person.name}>
          {person.name}: {person.number}{' '}
          <DeleteButton
            personId={person.id}
            persons={persons}
            setPersons={setPersons}
            setNotification={setNotification}
          />
        </li>
      ))
    : found.map((person) => (
        <li key={person.name}>
          {person.name}: {person.number}
        </li>
      ));
};
