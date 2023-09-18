const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&"+your_api_key+"1&page=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key="+your_api_key+"&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const pagination = document.getElementById("pagination");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");

let currentPage = 1;

// Initially get movies for the first page
getMovies(APIURL + currentPage);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    showMovies(respData.results);

    // Enable or disable pagination buttons based on current page
    if (currentPage > 1) {
        prevPageBtn.disabled = false;
    } else {
        prevPageBtn.disabled = true;
    }

    if (currentPage < respData.total_pages) {
        nextPageBtn.disabled = false;
    } else {
        nextPageBtn.disabled = true;
    }
}

function showMovies(movies) {
    // Clear main
    main.innerHTML = "";

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });
} 

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

        search.value = "";
    }
});

// Add event listeners for pagination buttons
prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(APIURL + currentPage);
    }
});

nextPageBtn.addEventListener("click", () => {
    currentPage++;
    getMovies(APIURL + currentPage);
});