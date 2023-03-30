import {
    addMovieToList,
    clearMovieMarkup,
    createMarkup,
    createStyle,
    inputSearch,
    moviesList,
    triggerMode
} from './dom.js';

let siteUrl = null;
let searchLast = ' ';

const getData = (url) => fetch(url)
    .then((res) => res.json())
    .then((json) => {

        if (!json || !json.Search) throw Error('Сервер вернул не правильный ответ.')

        return json.Search;
    });

const debounce = (() => {
    let timer = null;

    return (cb, ms) => {
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(cb, ms);
    };
})();

const inputSearchHandler = (e) => {
    debounce(() => {
        const searchString = e.target.value.trim();

        if (searchString && searchString.length > 3 && searchString !== searchLast) {

            if (!triggerMode) clearMovieMarkup(moviesList);

            getData(`https://www.omdbapi.com/?apikey=807ce5ba&s=${searchString}`)
                .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
                .catch((err) => console.error(err));
        }

        searchLast = searchString;
    }, 2000);
};

export const appInit = (url) => {
    createMarkup();
    createStyle();

    siteUrl = url || 'https://www.omdbapi.com/'

    inputSearch.addEventListener('keyup', inputSearchHandler)
}