const userId = localStorage.getItem('userId');
var favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
let ispis = "";
const imagePath = "https://image.tmdb.org/t/p/w500";
const detailsApi = "https://api.themoviedb.org/3/movie/";



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
    
    ispis += `<div class="card card-img-top" style="width: 15rem">
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
              Remove from favorites
            </button>
          </div>
        
    </div>
  </div>`;
  });
  document.getElementById("showcase").innerHTML = ispis;
  document.querySelectorAll(".remove").forEach((elem)=>elem.addEventListener("click", removeFavorite))
}else{ispis=`<h1>No movies added</h1>`;
document.getElementById("showcase").innerHTML = ispis; }}

//remove favorite



function removeFavorite(){
      const id = this.dataset.key;
    var noviNiz = favorites.filter(elem=>elem!=id);
   favorites = noviNiz;
   localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
   console.log(favorites);
   if(favorites!=[]){
   ispis="";
    }
    else{ispis=`<h1>No movies added</h1>` }getFavorites(favorites)
}   
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = '/index.html';
}