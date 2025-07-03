const pets = [
  { name: 'Buddy', species: 'dog', size: 'medium', age: 'young', temperament: 'friendly' },
  { name: 'Mittens', species: 'cat', size: 'small', age: 'adult', temperament: 'calm' },
  { name: 'Tweety', species: 'bird', size: 'small', age: 'adult', temperament: 'active' },
  { name: 'Thumper', species: 'rabbit', size: 'small', age: 'baby', temperament: 'shy' },
];

document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const species = document.getElementById('species').value;
  const size = document.getElementById('size').value;
  const age = document.getElementById('age').value;
  const temperament = document.getElementById('temperament').value;
  const results = pets.filter(pet => {
    return (species === '' || pet.species === species) &&
           (size === '' || pet.size === size) &&
           (age === '' || pet.age === age) &&
           (temperament === '' || pet.temperament === temperament);
  });
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  if (results.length > 0) {
    results.forEach(pet => {
      const card = document.createElement('div');
      card.className = 'pet-card';
      card.innerHTML = `<h3>${pet.name}</h3>
                        <p>Species: ${pet.species}</p>
                        <p>Size: ${pet.size}</p>
                        <p>Age: ${pet.age}</p>
                        <p>Temperament: ${pet.temperament}</p>`;
      resultsDiv.appendChild(card);
    });
  } else {
    resultsDiv.textContent = 'No pets match your criteria.';
  }
});