const APIURL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');


async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        console.log(data);

        createUserCard(data);
        getRepos(username);

    }
    catch (err) {
        if (err.response.status == 404) {
            createErrorCard('No user found!');
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created');
        addReposToCard(data);
    }
    catch (err) {
        createErrorCard('Problem fetching repos!');
    }
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card">
        <div>
          <img src="${user.avatar_url}" class="avatar" alt="${user.name}" />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>${user.bio}</p>

          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repositories</strong></li>
          </ul>

          <div id="repos"></div>
        </div>
      </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card error">
       <h1>${msg}</h1>
    </div>
    `
    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    repos
        .slice(1, 10)
        .forEach(
            repo => {
                const repoElement = document.createElement('a');
                repoElement.classList.add('repo');
                repoElement.href = repo.html_url;
                repoElement.target = '_blank';
                repoElement.innerText = repo.name;

                reposEl.appendChild(repoElement);
            }
        )
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;

    if (user) {
        getUser(user);
        search.value = '';
    }
})