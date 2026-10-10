const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then(res => res.json())
    .then(character => {
        const main = document.getElementById('character');

        // Проверяем одна ли локация
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
            <h3>Эпизоды</h3>
            <div id="character-episodes"></div>
        `;

        const episodesContainer = document.getElementById('character-episodes');

        // Загружаем все эпизоды параллельно
        Promise.all(
            character.episode.map(url => fetch(url).then(res => res.json()))
        ).then(episodes => {
            episodes.forEach(ep => {
                const div = document.createElement('p');
                div.innerHTML = `
                    <a href="episode.html?id=${ep.id}">
                        ${ep.episode} — ${ep.name} (${ep.air_date})
                    </a>
                `;
                episodesContainer.appendChild(div);
            });
        });
    });