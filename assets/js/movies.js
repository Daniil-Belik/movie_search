import {
    addMovieToList,
    clearMovieMarkup,
    createMarkup,
    createStyle,
    inputSearch,
    moviesList,
    triggerMode,
} from './dom.js';

const siteUrl = 'http://www.omdbapi.com/';

let searchLast = '';

const getData = (url) => {
    return fetch(url)
        .then((res) => {
            if (!res.ok) throw Error('Сервер вернул неправильный статус');
            return res.json();
        })
        .then((json) => {
            if (!json || !json.Search) throw Error('Сервер вернул неправильный ответ');
            return json.Search;
        })
        .catch((err) => console.error(err));
};

const debounce = (cb, delayMs) => {
    let timerId = null;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => cb(...args), delayMs);
    };
};

const inputSearchHandler = debounce((e) => {
    const searchString = e.target.value.trim();
    if (searchString.length > 3 && searchString !== searchLast) {
        clearMovieMarkup(moviesList);
        getData(`${siteUrl}?apikey=18b8609f&s=${searchString}`)
            .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
            .catch((err) => console.error(err));
    }
    searchLast = searchString;
}, 2000);

export const appInit = () => {
    createMarkup();
    createStyle();
    inputSearch.addEventListener('keyup', inputSearchHandler);
};
