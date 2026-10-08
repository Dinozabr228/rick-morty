let allCharacters = [];
let visibleCount = 20;


function renderCards(characters) {

    const cards = document.getElementById('cards');

    cards.innerHTML = '';

    const visibleCharacters = characters.slice(0, visibleCount);

    visibleCharacters.forEach(character => {

        const card = document.createElement('div');

        card.className = 'card';

        card.addEventListener('click', () => {
            window.location.href = `character.html?id=${character.id}`;
        });

        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <div class="card-info">
                <h3>${character.name}</h3>
                <p>${character.status}</p>
                <p>${character.location.name}</p>
            </div>
        `;

        cards.appendChild(card);
    });


    if (visibleCount < characters.length) {

       const button = document.createElement('button');

        button.className = 'load-more';
        button.textContent = 'Загрузить ещё';

        button.addEventListener('click', () => {

            visibleCount += 20;

            renderCards(characters);
        });

        cards.appendChild(button);
    }
}


function fillLocations(characters) {

    const locationSelect = document.getElementById('filter-location');

    const locations = new Set();

    characters.forEach(character => {
        locations.add(character.location.name);
    });

    locations.forEach(location => {

        const option = document.createElement('option');

        option.value = location;
        option.textContent = location;

        locationSelect.appendChild(option);
    });
}


function loadCharacters() {

    const status = document.getElementById('filter-status').value;
    const location = document.getElementById('filter-location').value;

    let filteredCharacters = allCharacters;


    if (status) {

    filteredCharacters = filteredCharacters.filter(character =>
        character.status.toLowerCase() === status.toLowerCase()
    );

    }


    if (location) {

        filteredCharacters = filteredCharacters.filter(character =>
            character.location.name === location
        );

    }


    visibleCount = 20;

    renderCards(filteredCharacters);
}


function loadAllCharacters() {

    fetch('https://rickandmortyapi.com/api/character')
        .then(res => res.json())
        .then(data => {

            const requests = [];

            for (let page = 1; page <= data.info.pages; page++) {

                requests.push(
                    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
                        .then(res => res.json())
                );

            }

            return Promise.all(requests);
        })
        .then(results => {

            results.forEach(data => {

                allCharacters = allCharacters.concat(data.results);

            });

            fillLocations(allCharacters);

            renderCards(allCharacters);
        });
}


const statusFilter = document.getElementById('filter-status');
const locationFilter = document.getElementById('filter-location');


statusFilter.addEventListener('change', () => {
    loadCharacters();
});


locationFilter.addEventListener('change', () => {
    loadCharacters();
});


loadAllCharacters();