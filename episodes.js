let allEpisodes = [];
let currentPage = 1;
const perPage = 10;

function renderEpisodes() {
    const container = document.getElementById('episodes');
    container.innerHTML = '';

    const start = (currentPage - 1) * perPage;
    const visible = allEpisodes.slice(start, start + perPage);

    visible.forEach(episode => {
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
        container.appendChild(card);
    });

    const totalPages = Math.ceil(allEpisodes.length / perPage);
    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    function addBtn(i) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.className = 'active';
        btn.addEventListener('click', () => {
            currentPage = i;
            renderEpisodes();
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

    container.appendChild(pagination);
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