const params = new URLSearchParams(window.location.search);
const id = params.get('id');


fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then(res => res.json())
    .then(character => {
        const main = document.getElementById('character');

        

        const sameLocation = character.origin.name === character.location.name;
        const locationText = sameLocation
            ? `<p><strong>Был только в:</strong> ${character.location.name}</p>`
            : `<p><strong>Происхождение:</strong> ${character.origin.name}</p>
               <p><strong>Текущая локация:</strong> ${character.location.name}</p>`;

        main.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <p><strong>Статус:</strong> ${character.status}</p>
            <p><strong>Вид:</strong> ${character.species}</p>
            <p><strong>Пол:</strong> ${character.gender}</p>
            ${locationText}
            <h3>Эпизоды (${character.episode.length})</h3>
            <div id="character-episodes"></div>
        `;

        const episodesContainer = document.getElementById('character-episodes');

        Promise.all(
            character.episode.map(url => fetch(url).then(res => res.json()))
        ).then(episodes => {
            episodes.forEach(ep => {
                const div = document.createElement('div');
                const season = parseInt(ep.episode.substring(1, 3));
                const epNum = parseInt(ep.episode.substring(4, 6));
                const opacity = 0.4 + (epNum / 10) * 0.6;

                div.className = `episode-card season-${season}`;
                if (sameLocation) {
                    div.innerHTML = `
                        <a href="episode.html?id=${ep.id}">
                            <p><strong>Эпизод:</strong> ${ep.episode}</p>
                            <p><strong>Название:</strong> ${ep.name}</p>
                            <p><strong>Дата:</strong> ${ep.air_date}</p>
                            <p><strong>Локация:</strong> ${character.location.name}</p>
                        </a>
                    `;
                    episodesContainer.appendChild(div);
                } else {
                    div.innerHTML = `
                        <a href="episode.html?id=${ep.id}">
                            <p><strong>Эпизод:</strong> ${ep.episode}</p>
                            <p><strong>Название:</strong> ${ep.name}</p>
                            <p><strong>Дата:</strong> ${ep.air_date}</p>
                            <p><strong>Локации:</strong> <span class="ep-locations">загрузка...</span></p>
                        </a>
                    `;
                    episodesContainer.appendChild(div);

                    Promise.all(
                        ep.characters.map(url => fetch(url).then(res => res.json()))
                    ).then(chars => {
                        const locs = new Set(chars.map(c => c.location.name));
                        div.querySelector('.ep-locations').textContent = [...locs].join(', ');
                    });
                }
            });
        });
    });
