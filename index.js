const inputSearch = document.querySelector('.repositories__search');
const repositoriesDatalist = document.querySelector('.repositories__data');
const repositoriesList = document.querySelector('.repositories__list');

let repoObjects;
let searchTimer;

inputSearch.addEventListener('input', (event) => {
    if (inputSearch.value === '') {
        clearTimeout(searchTimer);
        repositoriesDatalist.innerHTML = '';
    } else {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            getOptions();
        }, 250);
    }
});

// фокусировка на форме
inputSearch.addEventListener('focus', () => {
    repositoriesDatalist.style.maxHeight = `${repositoriesDatalist.scrollHeight}px`;
});

inputSearch.addEventListener('blur', () => {
    setTimeout(() => repositoriesDatalist.style.maxHeight = '0px', 50)
});

repositoriesList.addEventListener('click', (event) => {
    if (event.target.className === 'repositories__button repositories__button--close') {
        event.target.parentElement.style.transition = 'max-height 1s, transform 1s, padding 1s, margin 1s';
        event.target.parentElement.style.transform = 'rotateX(-90deg)';
        event.target.parentElement.style.border = 'none';
        event.target.parentElement.style.maxHeight = '0px';
        event.target.parentElement.style.marginBottom = '0px';
        event.target.parentElement.style.padding = '0px 20px';

        setTimeout(() => event.target.parentElement.remove(), 3000);
    }
});

// выводим инфо о репозитории на страницу
repositoriesDatalist.addEventListener('click', (event) => {
    if (event.target.className === 'repositories__option') {
        inputSearch.value = '';
        repositoriesDatalist.innerHTML = '';
        let li = renderItem(event.target);
        setTimeout(() => {
            li.style.maxHeight = `${li.scrollHeight}px`;
            li.style.transform = 'rotateX(0deg)';
        }, 50);
    }
});

function renderItem(element) {
    let repoName = element.textContent;
    let repo = repoObjects.find((item) => item.name === repoName);
    let li = document.createElement('li');
    li.classList.add('repositories__item');
    let name = document.createElement('span');
    name.classList.add('repositories__name');
    name.classList.add('repositories__span');
    name.textContent = repo.name;
    let owner = document.createElement('span');
    owner.classList.add('repositories__owner');
    owner.classList.add('repositories__span');
    owner.textContent = repo.owner.login;
    let stars = document.createElement('span');
    stars.classList.add('repositories__stars');
    stars.classList.add('repositories__span');
    stars.textContent = repo.stargazers_count;
    let btnClose = document.createElement('button');
    btnClose.classList.add('repositories__button');
    btnClose.classList.add('repositories__button--close');

    li.append(name);
    li.append(owner);
    li.append(stars);
    li.append(btnClose);
    repositoriesList.append(li);
    return li;
}

async function searchRepository() {
    try {
        return fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(`${inputSearch.value} in:name`)}&sort=stars&per_page=5`, {
            headers: {
                Accept: 'application/vnd.github+json',
            }
        })
            .then( (response) => response.json())
    } catch (error) {
        console.log(error);
    }
}

function renderOptions(repos) {
    repositoriesDatalist.innerHTML = '';
    let fragment = document.createDocumentFragment();

    for (let repo of repos){
        let option = document.createElement('li');
        option.classList.add('repositories__option');
        option.textContent = repo.name;
        fragment.append(option);
    }
    repositoriesDatalist.append(fragment);
    repositoriesDatalist.style.maxHeight = `${repositoriesDatalist.scrollHeight}px`;
}

// вывод ошибки, если репозитория нет
async function getOptions() {
    let result = await searchRepository();
    if (Array.isArray(result.items)) {
        if (result.items.length === 0) {
            errorOptions('No repository found!')
        } else {
            repoObjects = result.items;
            renderOptions(result.items);
        }
    } else {
        console.log(result);
        errorOptions(result.message);
    }
}

function errorOptions(message) {
    const error = document.createElement('span');
    error.textContent = message;
    error.classList.add('repositories__error');
    repositoriesDatalist.innerHTML = '';
    repositoriesDatalist.append(error);
    repositoriesDatalist.style.maxHeight = `${repositoriesDatalist.scrollHeight}px`;
}
