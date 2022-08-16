const BASE_URL = 'https://restcountries.com/v3.1/name';
export default function fetchCountries(search) {
  return fetch(
    `${BASE_URL}/${search}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
}
