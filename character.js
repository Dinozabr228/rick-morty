const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then(res => res.json())
    .then(character => {

        const main = document.getElementById('character');

        main.innerHTML = `
            <img src="${character.image}" alt="${character.name}">

            <h2>${character.name}</h2>

            <p><strong>Статус:</strong> ${character.status}</p>
            <p><strong>Вид:</strong> ${character.species}</p>
            <p><strong>Пол:</strong> ${character.gender}</p>
            <p><strong>Происхождение:</strong> ${character.origin.name}</p>
            <p><strong>Текущая локация:</strong> ${character.location.name}</p>

            <h3>Эпизоды</h3>
            <div id="character-episodes"></div>
        `;

        const episodesContainer =
            document.getElementById('character-episodes');

        character.episode.forEach(url => {

            const episodeId = url.split('/').pop();

            const episode = document.createElement('p');

            episode.innerHTML = `
                <a href="episode.html?id=${episodeId}">
                    Эпизод ${episodeId}
                </a>
            `;

            episodesContainer.appendChild(episode);
        });
    });