const userId = localStorage.getItem('userId');
var playlists = JSON.parse(localStorage.getItem(`playlists_${userId}`) || "[]");
const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
const detailsApi = "https://api.themoviedb.org/3/movie/";
const imagePath = "https://image.tmdb.org/t/p/w500";
const selectPlaylist = document.getElementById("selectPlaylist");
let ispis = "";
let zaPrikaz;
const addB = document.getElementById("add");
const deleteB = document.getElementById("delete");
let foundPlaylist;

const playlistsNames = playlists.forEach((elem, index) => {
  ispis += `<option value="${index + 1}">${elem.name}</option>`;
});
selectPlaylist.innerHTML += ispis;
selectPlaylist.addEventListener("change", showPlaylist);
addB.addEventListener("click", async () => getFavorites(favorites));
deleteB.addEventListener("click", deletePlaylist);

//prikaz playlista na odabir iz select-a
async function showPlaylist(event) {
  const selectedPlaylist =
    event.target.options[event.target.selectedIndex].innerHTML;

  foundPlaylist = playlists.find((elem) => elem.name === selectedPlaylist);
  document.getElementById("playlist-desc").innerText=foundPlaylist.desc;
  document.getElementById("playlist-desc").style.border="1px solid #aaa"
  zaPrikaz = foundPlaylist.movies;
  let filmovi = [];
  await Promise.all(
    zaPrikaz.map(async (elem) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${elem.id}?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US`
      );
      const data = await response.json();
      filmovi.push(data);
    })
  );
  showMovies(filmovi);
}

async function showMovies(elem) {
  let ispis2 = "";

  elem.forEach((elem) => {
    const posterPath = elem.poster_path
      ? imagePath + elem.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image+Available";
    const releaseYear = elem.release_date
      ? elem.release_date.slice(0, 4)
      : "not set yet";

    ispis2 += `<div class="card card-img-top" style="width: 15rem">
      <img
        src="${posterPath}"
        class="card-img-top h-100"
        alt="..."
      />
      <div class="card-body">
        <h5 class="card-title">${elem.title}</h5>
        <p class="card-text">${releaseYear}</p>
        <div class="card-footer d-flex justify-content-center">
              <button class="btn btn-danger w-75 remove" data-key="${elem.id}">
                Remove from the playlist
              </button>
            </div>
          
      </div>
    </div>`;
  });
  document.getElementById("showcase").innerHTML = ispis2;
  document.querySelectorAll(".remove").forEach((elem) => {
    elem.addEventListener("click", deleteMovie);
  });
}
//brisanje filma iz playliste
async function deleteMovie(e) {
  e.preventDefault();
  const id = this.dataset.key;
  var noviNiz = zaPrikaz.filter((elem) => elem.id != id);

  var novaPlaylista = noviNiz.filter((elem) =>
    foundPlaylist.movies.includes(elem)
  );

  foundPlaylist.movies = novaPlaylista;

  const updatedPlaylists = playlists.filter(
    (elem) => elem.name !== foundPlaylist.name
  );
  const modifiedPlaylista = {
    name: foundPlaylist.name,
    desc: foundPlaylist.desc,
    movies: novaPlaylista,
  };
  updatedPlaylists.push(modifiedPlaylista);

  localStorage.setItem(`playlists_${userId}`, JSON.stringify(updatedPlaylists));

  console.log(modifiedPlaylista.movies);
  let filmovi = [];
  await Promise.all(
    modifiedPlaylista.movies.map(async (elem) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${elem.id}?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US`
      );
      const data = await response.json();
      filmovi.push(data);
    })
  );
  showMovies(filmovi);
}
//dodavanje filmova u plejlistu
async function getFavorites(favorites) {
  const filmovi = [];
  await Promise.all(
    favorites.map(async (id) => {
      const data = await fetch(
        `${detailsApi}${id}?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US`
      ).then((res) => res.json());
      filmovi.push(data);
    })
  );
  showFavorites(filmovi);
}

async function showFavorites(elem) {
  if (favorites.length !== 0) {
    ispis = "";

    elem.forEach((elem) => {
      const posterPath = elem.poster_path
        ? imagePath + elem.poster_path
        : "https://via.placeholder.com/500x750?text=No+Image+Available";
      const releaseYear = elem.release_date
        ? elem.release_date.slice(0, 4)
        : "not set yet";

      ispis += `
      
      <div class="card card-img-top" style="width: 15rem">
      <img
        src="${posterPath}"
        class="card-img-top h-100"
        alt="..."
      />
      <div class="card-body">
        <h5 class="card-title">${elem.title}</h5>
        <p class="card-text">${releaseYear}</p>
        <div class="card-footer d-flex justify-content-center">
              <button class="btn btn-primary w-75 add" data-key="${elem.id}">
                Add to playlist
              </button>
            </div>
            </div>
  
    </div>`;
    });
    document.getElementById("favorites-window").innerHTML += ispis;
    document.getElementById("favorites-window").style.display = "flex";

    document.querySelector(".closeBtn").addEventListener("click", function () {
      document.getElementById("favorites-window").style.display = "none";
      document.getElementById(
        "favorites-window"
      ).innerHTML = `<h2 class="closeBtn">&times;</h2>`;
      //showPlaylist();
    });
    document
      .querySelectorAll(".add")
      .forEach((elem) => elem.addEventListener("click", addToPlaylist));
  }
}

async function addToPlaylist() {
  const key = this.dataset.key;
  const response = await fetch(
    detailsApi +
      key +
      "?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US"
  );
  const data = await response.json();
  const film = {
    title: data.title,
    year: parseInt(data.release_date),
    image: "https://image.tmdb.org/t/p/w500" + data.poster_path,
    id: data.id,
  };

  if (foundPlaylist.movies.find((elem) => elem.id === film.id)) {
    alert("Movie already added to this playlist");
  } else {
    foundPlaylist.movies.push(film);

    const updatedPlaylists = playlists.filter(
      (elem) => elem.name !== foundPlaylist.name
    );
    const modifiedPlaylista = {
      name: foundPlaylist.name,
      desc: foundPlaylist.desc,
      movies: foundPlaylist.movies,
    };
    updatedPlaylists.push(modifiedPlaylista);
    localStorage.setItem(`playlists_${userId}`, JSON.stringify(updatedPlaylists));
    alert("Successfully added to the playlist");
    document.getElementById("favorites-window").style.display = "none";

    location.reload();

  }
}
//brisanje plejliste
async function deletePlaylist() {
  if (selectPlaylist.value != 0) {
  
   
      var selectedIndex = selectPlaylist.selectedIndex;
      var selectedPlaylist = selectPlaylist.options[selectedIndex].innerHTML;
      const newPlaylists = playlists.filter(
        (elem) => elem.name !== selectedPlaylist
      );

      localStorage.setItem(`playlists_${userId}`, JSON.stringify(newPlaylists));
      location.reload();
 
  } else {
    alert("No playlist selected!");
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'http://localhost:3000/index.html';
}