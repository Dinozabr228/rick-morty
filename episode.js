const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`https://rickandmortyapi.com/api/episode/${id}`)
    .then(res => res.json())
    .then(episode => {

        const main = document.getElementById('episode');

        main.innerHTML = `
            <div class="episode-info">
                <h2>${episode.name}</h2>

                <p><strong>Эпизод:</strong> ${episode.episode}</p>
                <p><strong>Дата выхода:</strong> ${episode.air_date}</p>
            </div>

            <h3>Персонажи</h3>

            <div id="characters" class="cards"></div>

            <h3>Локации</h3>

            <div id="locations"></div>
        `;

        return Promise.all(
            episode.characters.map(url =>
                fetch(url).then(res => res.json())
            )
        ).then(characters => {

            const charactersContainer =
                document.getElementById('characters');

            const locationsContainer =
                document.getElementById('locations');


            /* Персонажи */

            characters.forEach(character => {

                const card = document.createElement('div');

                card.className = 'card';

                card.addEventListener('click', () => {
                    window.location.href =
                        `character.html?id=${character.id}`;
                });

                card.innerHTML = `
                    <img src="${character.image}" alt="${character.name}">

                    <div class="card-info">
                        <h3>${character.name}</h3>
                        <p>${character.status}</p>
                        <p>${character.location.name}</p>
                    </div>
                `;

                charactersContainer.appendChild(card);
            });


            /* Локации */

            const locations = new Set();

            characters.forEach(character => {
                locations.add(character.location.name);
            });


            locations.forEach(location => {

                locationsContainer.innerHTML += `
                    <p>${location}</p>
                `;

            });

        });
    });