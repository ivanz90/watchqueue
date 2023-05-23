const userId = localStorage.getItem('userId');
const create = document.getElementById("create");
let playlistName = document.getElementById("playlist-name");
let playlistDesc = document.getElementById("playlist-desc");
const listname =  document.getElementById("listname")
var favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
let ispis = "";
let ispis2 = "";
const imagePath = "https://image.tmdb.org/t/p/w500";
const detailsApi = "https://api.themoviedb.org/3/movie/";
let playlistNiz=[];
let playlists=[]


create.addEventListener("click", createPlaylist)


async function createPlaylist(e) {
  //e.preventDefault();

  if (playlistNiz !== []) {
    const moviePromises = playlistNiz.map((id) =>
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US`)
        .then((res) => res.json())
    );

    Promise.all(moviePromises)
      .then((movieData) => {
        const playlist = {
          name: playlistName.value,
          desc: playlistDesc.value,
          movies: movieData.map((movie) => ({
            title: movie.title,
            year: parseInt(movie.release_date),
            image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
            id:movie.id,
          })),
        };

        let playlists = JSON.parse(localStorage.getItem(`playlists_${userId}`)) || [];
        const updatedPlaylists = [...playlists, playlist];
        localStorage.setItem(`playlists_${userId}`, JSON.stringify(updatedPlaylists));
        console.log(updatedPlaylists);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}




async function addToPlaylist(){
    const key = this.dataset.key;
    const film = await fetch(
      detailsApi +
        key +
        "?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US"
    ).then((res) => res.json());
    
    if (playlistNiz.indexOf(film.id)===-1){
        playlistNiz.push(film.id);
        ispis2=`<li>${film.title}</li>`;
        document.getElementById("listOfMovies").innerHTML+=ispis2;
        document.getElementById("listOfMovies").style.border="1px solid #aaa";
        document.getElementById("listOfMovies").style.borderRadius="10px"
        console.log(playlistNiz)
    }else{
        alert("Movie already added to this playlist")
    }
}




getFavorites(favorites);

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
    if(favorites.length!==0){
        ispis="";
         
         
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
            <button class="btn btn-primary w-75 addToPlaylist" data-key="${elem.id}">
              Add to the playlist
            </button>
          </div>
        
    </div>
  </div>`;
  });
  document.getElementById("showcase").innerHTML = ispis;
  document.querySelectorAll(".addToPlaylist").forEach((elem)=>elem.addEventListener("click", addToPlaylist))

}else{ispis=`<h1>No movies added</h1>`;
document.getElementById("showcase").innerHTML = ispis; }}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'http://localhost:3000/index.html';
}