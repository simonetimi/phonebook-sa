import axios from 'axios';

const url = '/api/persons';

export async function fetchAll() {
  const response = await axios.get(url);
  return response.data;
}

export async function createOnDb(newPerson) {
  return await axios.post(url, newPerson);
}

export async function updateOnDb(newPerson, personId) {
  return await axios.put(`${url}/${personId}`, newPerson);
}

export async function removeFromDb(personId) {
  return await axios.delete(`${url}/${personId}`);
}
