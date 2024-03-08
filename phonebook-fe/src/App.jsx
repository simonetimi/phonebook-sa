import { useEffect, useState } from 'react';
import { Search } from './components/Search';
import { NewPerson } from './components/NewPerson';
import { ShowPeople } from './components/ShowPeople';
import { Notification } from './components/Notification';
import { v4 as uuidv4 } from 'uuid';
import { fetchAll, createOnDb, updateOnDb } from './helpers/connect';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [found, setFound] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    type: '',
  });

  useEffect(() => {
    (async () => {
      const data = await fetchAll();
      setPersons(data);
    })();
  }, []);

  const handleOnChangeName = (event) => {
    setNewName(event.target.value);
  };

  const handleOnChangePhone = (event) => {
    setNewPhone(event.target.value);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const nameIsPresent = persons.some((person) => person.name === newName);
    const phoneIsPresent = persons.some((person) => person.number === newPhone);
    if (nameIsPresent) {
      try {
        const personToUpdate = persons.find((person) => person.name === newName);
        const updatedPersonWithNewNumber = { ...personToUpdate, number: newPhone };
        await updateOnDb(updatedPersonWithNewNumber, updatedPersonWithNewNumber.id);
        const updatedPersons = persons.map((person) =>
          person.id === personToUpdate.id ? updatedPersonWithNewNumber : person
        );
        setPersons(updatedPersons);
        setNotification({ type: 'success', message: `Contact "${personToUpdate.name}" updated!` });
        return;
      } catch (error) {
        setNotification({
          type: 'error',
          message: `Error updating phone number! ${error.response.data.error}`,
        });
        return;
      }
    } else if (phoneIsPresent) {
      setNotification({
        type: 'error',
        message: `Phone number: ${newPhone} is already present.`,
      });
      return;
    }
    try {
      const newPerson = { name: newName, number: newPhone, id: uuidv4() };
      await createOnDb(newPerson);
      setPersons([...persons, newPerson]);
      setNotification({
        type: 'success',
        message: `Contact "${newPerson.name}" added!`,
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Error adding contact! Error: ${error.response.data.error}}`,
      });
    }
  };

  const handleOnChangeSearch = (event) => {
    const search = event.target.value;
    setSearchInput(search);
    setFound(persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase())));
  };

  return (
    <div>
      <Notification type={notification.type} message={notification.message} />
      <h2>Phonebook</h2>
      <Search handleOnChangeSearch={handleOnChangeSearch} searchInput={searchInput} />
      <hr />
      <NewPerson
        newName={newName}
        handleOnChangeName={handleOnChangeName}
        newPhone={newPhone}
        handleOnChangePhone={handleOnChangePhone}
        handleOnSubmit={handleOnSubmit}
      />

      <h2>Numbers</h2>
      <ShowPeople
        searchInput={searchInput}
        persons={persons}
        found={found}
        setPersons={setPersons}
        setNotification={setNotification}
      />
    </div>
  );
};

export default App;
