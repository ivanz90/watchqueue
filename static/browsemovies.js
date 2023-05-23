const results = document.getElementById("results");
const search = document.getElementById("search");
const next = document.getElementById("next");
const userId = localStorage.getItem('userId');
let url =
  "https://api.themoviedb.org/3/movie/popular?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&page=";
const imagePath = "https://image.tmdb.org/t/p/w500";
let searchApi =
  "https://api.themoviedb.org/3/search/movie?api_key=10124ffdfa7546a35865493a550a4cb9&query=";
const detailsApi = "https://api.themoviedb.org/3/movie/";
var favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
let page = parseInt(document.getElementById("page").textContent);

console.log(userId)
getMovies(url, 1);

async function getMovies(url, page) {
  const data = await fetch(url + page).then((res) => res.json());
  showMovies(data.results);
}
//prikaz filmova
async function showMovies(data) {
  let ispis = "";
  data.forEach((element) => {
    const posterPath = element.poster_path
      ? imagePath + element.poster_path
      : "https://via.placeholder.com/500x750?text=No+Image+Available";
    const releaseYear = element.release_date
      ? element.release_date.slice(0, 4)
      : "not set yet";
    ispis += ` 
          <div class="card card-img-top" style="width: 15rem;">
           <div class="imgCard"> <img src="${posterPath}" class="card-img-top" alt="..."></div>
            <div class="card-body">
              <h5 class="card-title">${element.title} </h5>
              <p class="card-text">${releaseYear}</p>
              <div class="card-footer">
                <div class="row">
                  <div class="col-6">
                    <button class="btn btn-primary btn-block favorites" data-key="${element.id}">Add to favorites</button>
                  </div>
                  <div class="col-6">
                    <button class="btn btn-secondary btn-block details" data-key="${element.id}">View Details</button>
                  </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
    </div>`;
    results.innerHTML = ispis;
    document
      .querySelectorAll(".details")
      .forEach((elem) => elem.addEventListener("click", showDetails));
    document
      .querySelectorAll(".favorites")
      .forEach((elem) => elem.addEventListener("click", addTofavorites));
  });
}

//search
search.addEventListener("keyup", searchMovies);

async function searchMovies() {
  const value = search.value;
  if (value!="") {
    const data = await fetch(searchApi + value).then((res) => res.json());
    showMovies(data.results);
   // console.log(url+value)
  } else {
    getMovies(url, 1);
  }
  document.querySelector(
    ".pagination"
  ).innerHTML = `<span id="page">${page}</span>
    <span id="next">></span>`;
    document.getElementById("next").addEventListener("click", nextPage);
}

//next - previous
next.addEventListener("click", nextPage);

async function nextPage (){
  let page = parseInt(document.getElementById("page").textContent);
  page++;
  let searchUrlWithPage ;
  if(search.value==""){ searchUrlWithPage =  url+`&page=${page}`;}
  else{searchUrlWithPage = searchApi+search.value+`&page=${page}` }
  const data = await fetch(searchUrlWithPage).then(res=>res.json());  
  showMovies(data.results)

if(page<data.total_pages){
  document.querySelector(
    ".pagination"
  ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
    <span id="next">></span>`;
  document.getElementById("next").addEventListener("click", nextPage);
  document.getElementById("previous").addEventListener("click", previousPage);

}
if(page==data.total_pages){
  document.querySelector(
    ".pagination"
  ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>`;
 
    document.getElementById("previous").addEventListener("click", previousPage);

}
}
async function previousPage() {
  let page = parseInt(document.getElementById("page").textContent);
  page--;
  let searchUrlWithPage ;
  if(search.value==""){ searchUrlWithPage =  url+`&page=${page}`;}
  else{searchUrlWithPage = searchApi+search.value+`&page=${page}` }
  const data = await fetch(searchUrlWithPage).then(res=>res.json());
  showMovies(data.results)
  if (page > 1) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
    <span id="next">></span>`;
    document.getElementById("previous").addEventListener("click", previousPage);
    document.getElementById("next").addEventListener("click", nextPage);
  }
  if (page == 1) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${page}</span>
  <span id="next">></span>`;
  }
  document.getElementById("next").addEventListener("click", nextPage);
}


//show details
async function showDetails() {
  const detailsWindow = document.getElementById("details-window");
  const key = this.dataset.key;
  //synopsis and genre
  const data = await fetch(
    detailsApi +
      key +
      "?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US"
  ).then((res) => res.json());
  const genres =data.genres;
  const genre=genres.map(el=>{return el.name})
  //actors
  const cast = await fetch(
    detailsApi + key + "/credits?api_key=10124ffdfa7546a35865493a550a4cb9"
  )
    .then((res) => res.json())
    .then((results) =>
      results.cast.filter((member) => member.known_for_department === "Acting")
    );
  const mainCast = cast.filter((member) => member.order < 6);
  const actorsNames = mainCast.map((member) => member.name);
  //director
  const director = await fetch(
    detailsApi + key + "/credits?api_key=10124ffdfa7546a35865493a550a4cb9"
  )
    .then((res) => res.json())
    .then((results) =>
      results.crew.find((member) => member.job === "Director")
    );
  //screenplay
  const screenplay = await fetch(
    detailsApi + key + "/credits?api_key=10124ffdfa7546a35865493a550a4cb9"
  )
    .then((res) => res.json())
    .then((results) =>
      results.crew.find((member) => member.known_for_department === "Writing")
    );
  //console.log(genre);
  let imageURL = data.backdrop_path ? imagePath + data.backdrop_path : "https://via.placeholder.com/500x750?text=No+Image+Available"
  let ispis = "";
  ispis += `
  <div id = "detailsW">
  <div id="details-content">
    <div id="details-header">
      <span class="closeBtn">&times;</span>
      <h2>${data.title}</h2>
    </div>
    <div id="details-body">
   
        <img src="${imageURL}" alt="${
    data.title
  }" class="slika"><br><table>
        <tr><td>Genre: </td><td> ${genre}</td></tr>
       <tr><td>Synopsis: </td><td> ${data.overview}</td></tr>
       <tr><td>Starring: </td><td> ${actorsNames}</td></tr>
       <tr><td>Director: </td><td> ${director.name}</td></tr>
       <tr><td>Screenplay: </td><td> ${screenplay.name}</td></tr>
       <tr><td>Release_date:&nbsp &nbsp &nbsp</td><td> ${
         data.release_date
       }</td></tr>
       </table>
    </div>
    </div>
</div>`;
  detailsWindow.innerHTML = ispis;
  document.getElementById("detailsW").style.display = "block";
  document.querySelector(".closeBtn").addEventListener("click", function () {
    document.getElementById("detailsW").style.display = "none";
  });
}

//add to favorites
async function addTofavorites() {
  const key = this.dataset.key;
  const film = await fetch(
    detailsApi +
      key +
      "?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US"
  ).then((res) => res.json());
  
  if (favorites.indexOf(film.id)===-1){
  favorites.push(film.id);
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  console.log(favorites)} else{
    alert("You have already added this to your favorites")
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'http://localhost:3000/index.html';
}