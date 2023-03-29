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
const debounceDelayMs = 2000;

const getData = (url) => fetch(url)
    .then((res) => {
        if (!res.ok) throw Error('Сервер вернул неправильный статус');
        return res.json();
    })
    .then((json) => {
        if (!json || !json.Search) throw Error('Сервер вернул неправильный ответ');
        return json.Search;
    })
    .catch((err) => console.error(err));

const debounce = (cb, delayMs) => {
    let timerId = null;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => cb(...args), delayMs);
    };
};

const inputSearchHandler = debounce((e) => {
    const searchString = e.target.value.trim();
    if (searchString.length > 3) {
        if (!triggerMode) clearMovieMarkup(moviesList);
        getData(`${siteUrl}?apikey=18b8609f&s=${searchString}`)
            .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
            .catch((err) => console.error(err));
    }
}, debounceDelayMs);

export const appInit = () => {
    createMarkup();
    createStyle();
    inputSearch.addEventListener('keyup', inputSearchHandler);
};
