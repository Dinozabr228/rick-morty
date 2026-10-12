let allCharacters = [];
let currentPage = 1;
const perPage = 10;


function renderCards(characters) {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = characters.slice(start, end);

    visible.forEach(character => {
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

    const totalPages = Math.ceil(characters.length / perPage);
const pagination = document.createElement('div');
pagination.className = 'pagination';

function addBtn(i) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.className = 'active';
    btn.addEventListener('click', () => {
        currentPage = i;
        renderCards(characters);
        window.scrollTo(0, 0);
    });
    pagination.appendChild(btn);
}

function addDots() {
    const span = document.createElement('span');
    span.textContent = '...';
    pagination.appendChild(span);
}

addBtn(1);

if (currentPage > 3) addDots();

for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    addBtn(i);
}

if (currentPage < totalPages - 2) addDots();

if (totalPages > 1) addBtn(totalPages);

cards.appendChild(pagination);
}


function fillLocations(characters) {
    const locationList = document.getElementById('location-list');

    if(!locationList ) return;

    const locations = new Set();

    characters.forEach(character => {
        locations.add(character.location.name);
    });

    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        locationList.appendChild(option);
    });
}


function loadCharacters() {
    const status = document.getElementById('filter-status').value;
    const location = document.getElementById('filter-location').value;
    const search = document.getElementById('search').value.toLowerCase();

    let filteredCharacters = allCharacters;

    if (status) {
        filteredCharacters = filteredCharacters.filter(character =>
            character.status.toLowerCase().includes(status.toLowerCase())
        );
    }

    if (location) {
        filteredCharacters = filteredCharacters.filter(character =>
            character.location.name.toLowerCase().includes(location.toLowerCase())
        );
    }

    if (search) {
        filteredCharacters = filteredCharacters.filter(character =>
            character.name.toLowerCase().includes(search)
        );
    }

    currentPage = 1;
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

            const namesList = document.getElementById('names-list');
                allCharacters.forEach(character => {
                const option = document.createElement('option');
                option.value = character.name;
                namesList.appendChild(option);
                });

        });

}


const statusFilter = document.getElementById('filter-status');
const locationFilter = document.getElementById('filter-location');


statusFilter.addEventListener('input', () => {
    loadCharacters();
});


locationFilter.addEventListener('input', () => {
    loadCharacters();
});

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', ()=>{
    loadCharacters()
});

loadAllCharacters();

