let allEpisodes = [];
let visibleCount = 20;


function renderEpisodes() {

    const episodesContainer = document.getElementById('episodes');

    episodesContainer.innerHTML = '';

    const visibleEpisodes = allEpisodes.slice(0, visibleCount);

    visibleEpisodes.forEach(episode => {

        const card = document.createElement('div');

        card.className = 'episode';

        card.addEventListener('click', () => {
            window.location.href = `episode.html?id=${episode.id}`;
        });

        card.innerHTML = `
            <h2>${episode.name}</h2>
            <p>${episode.episode}</p>
            <p>${episode.air_date}</p>
        `;

        episodesContainer.appendChild(card);
    });


    if (visibleCount < allEpisodes.length) {

        const button = document.createElement('button');

        button.textContent = 'Загрузить ещё';

        button.addEventListener('click', () => {

            visibleCount += 20;

            renderEpisodes();
        });

        episodesContainer.appendChild(button);
    }
}


function loadEpisodes() {

    fetch('https://rickandmortyapi.com/api/episode')
        .then(res => res.json())
        .then(data => {

            const requests = [];

            for (let page = 1; page <= data.info.pages; page++) {

                requests.push(
                    fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
                        .then(res => res.json())
                );

            }

            return Promise.all(requests);
        })
        .then(results => {

            results.forEach(data => {
                allEpisodes = allEpisodes.concat(data.results);
            });

            renderEpisodes();
        });
}


loadEpisodes();