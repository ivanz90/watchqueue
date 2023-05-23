const userId = localStorage.getItem('userId');
let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&include_adult=false&include_video=false`;
const submit = document.getElementById("submit");
const imagePath = "https://image.tmdb.org/t/p/w500";
const detailsApi = "https://api.themoviedb.org/3/movie/";
let favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
const next = document.getElementById("next");
let allResults = [];

submit.addEventListener("click", getResults);

//pretraga po parametrima
async function getResults(e) {
  e.preventDefault();
  document.getElementById("page").textContent = "1";

  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;
  const year = document.getElementById("year").value;
  const order = document.getElementById("order-by").value;
  let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&sort_by=${order}&include_adult=false&include_video=false&${year}&vote_average.gte=${rating}&with_genres=${genre}&with_watch_monetization_types=flatrate`;

  const data = await fetch(discoverUrl).then((res) => res.json());
  showMovies(data.results);
  document.getElementById("search3").style.visibility = "visible";
  document.querySelector(
    ".pagination"
  ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${data.page}</span>
<span id="next">></span><span id="total">...${data.total_pages}</span>`;
  document.getElementById("next").addEventListener("click", nextPage);
  let page1 = parseInt(data.page);
  let urls = [];
  while (page1 < data.total_pages) {
    urls.push(`${discoverUrl}&page=${page1}`);
    page1++;
  }
  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  Promise.all(promises).then((results) => {
    const allData = results.flatMap((data) => data.results);
    //console.log(allData);
    allResults.push(...allData);
  });

  //console.log(allResults)

  document
    .getElementById("movieSearch")
    .addEventListener("keyup", searchResults);
}
//prikaz rezultata
async function showMovies(data) {
  let page = parseInt(document.getElementById("page").textContent);
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
              <div class="imgCard"><img src="${posterPath}" class="card-img-top" alt="..."></div>
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
//add to favorites
async function addTofavorites() {
  const key = this.dataset.key;
  const film = await fetch(
    detailsApi +
      key +
      "?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US"
  ).then((res) => res.json());

  if (favorites.indexOf(film.id) === -1) {
    favorites.push(film.id);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
    console.log(favorites);
  } else {
    alert("You have already added this to your favorites");
  }
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
  const genres = data.genres;
  const genre = genres.map((el) => {
    return el.name;
  });
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
  let ispis = "";
  ispis += `
    <div id = "detailsW">
    <div id="details-content">
      <div id="details-header">
        <span class="closeBtn">&times;</span>
        <h2>${data.title}</h2>
      </div>
      <div id="details-body">
     
          <img src="${imagePath + data.backdrop_path}" alt="${
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
//next-previous
async function nextPage() {
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;
  const year = document.getElementById("year").value;
  const order = document.getElementById("order-by").value;
  let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&sort_by=${order}&include_adult=false&include_video=false&${year}&vote_average.gte=${rating}&with_genres=${genre}&with_watch_monetization_types=flatrate`;

  let page = parseInt(document.getElementById("page").textContent);
  page++;
  let discoverUrlWithPage = discoverUrl + `&page=${page}`;
  const data = await fetch(discoverUrlWithPage).then((res) => res.json());

  showMovies(data.results);

  if (page < data.total_pages) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
    <span id="next">></span><span id="total">...${data.total_pages}</span>`;
    document.getElementById("next").addEventListener("click", nextPage);
    document.getElementById("previous").addEventListener("click", previousPage);
  }
  if (page == data.total_pages) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span><span id="next">&nbsp;</span><span id="total">...${data.total_pages}</span>`;

    document.getElementById("previous").addEventListener("click", previousPage);
    document.getElementById("next").removeEventListener("click", nextPage);
  }
}
async function previousPage() {
  const genre = document.getElementById("genre").value;
  const rating = document.getElementById("rating").value;
  const year = document.getElementById("year").value;
  const order = document.getElementById("order-by").value;
  let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&sort_by=${order}&include_adult=false&include_video=false&${year}&vote_average.gte=${rating}&with_genres=${genre}&with_watch_monetization_types=flatrate`;

  let page = parseInt(document.getElementById("page").textContent);
  page--;
  let discoverUrlWithPage = discoverUrl + `&page=${page}`;
  const data = await fetch(discoverUrlWithPage).then((res) => res.json());
  showMovies(data.results);
  if (page > 1) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
    <span id="next">></span><span id="total">...${data.total_pages}</span>`;
    document.getElementById("previous").addEventListener("click", previousPage);
    document.getElementById("next").addEventListener("click", nextPage);
  }
  if (page == 1) {
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${page}</span>
  <span id="next">></span><span id="total">...${data.total_pages}</span>`;
  }
  document.getElementById("next").addEventListener("click", nextPage);
}
//search rezultata iz pretrage po parametrima
async function searchResults(event) {
  let filteredData20 = [];
  const searchValue = event.target.value.toLowerCase();

  const filteredData = allResults.filter((elem) =>
    elem.title.toLowerCase().includes(searchValue)
  );

  if (searchValue !== "") {
    for (let i = 0; i <= filteredData.length; i += 20) {
      filteredData20.push(filteredData.slice(i, i + 20));
    }
    page = 1;
    showMovies(filteredData20[page - 1]);
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${page}</span>
    <span id="next">></span><span id="total">...${Math.floor(
      filteredData.length / 20
    )+1}</span>`;
    document.getElementById("next").addEventListener("click", nextPage2);
  } else {
    const genre = document.getElementById("genre").value;
    const rating = document.getElementById("rating").value;
    const year = document.getElementById("year").value;
    const order = document.getElementById("order-by").value;
    let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&sort_by=${order}&include_adult=false&include_video=false&${year}&vote_average.gte=${rating}&with_genres=${genre}&with_watch_monetization_types=flatrate`;

    const data = await fetch(discoverUrl).then((res) => res.json());
    showMovies(data.results);
    document.querySelector(
      ".pagination"
    ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${page}</span>
    <span id="next">></span><span id="total">...${data.total_pages}</span>`;
    document.getElementById("next").addEventListener("click", nextPage);
  }
//next-previous 2
  function previousPage2() {
    let page = parseInt(document.getElementById("page").textContent);
    page--;
    showMovies(filteredData20[page - 1]);
    if (page == 1) {
      document.querySelector(
        ".pagination"
      ).innerHTML = `<span id="previous">&nbsp;</span><span id="page">${page}</span>
      <span id="next">></span><span id="total">...${
        Math.floor(filteredData.length / 20) + 1
      }</span>`;
      document.getElementById("next").addEventListener("click", nextPage2);
    }
    if (page > 1) {
      document.querySelector(
        ".pagination"
      ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
      <span id="next">></span><span id="total">...${
        Math.floor(filteredData.length / 20) + 1
      }</span>`;
      document
        .getElementById("previous")
        .addEventListener("click", previousPage2);
      document.getElementById("next").addEventListener("click", nextPage2);
    }

  }

  function nextPage2() {
    let page = parseInt(document.getElementById("page").textContent);
    page++;
    showMovies(filteredData20[page - 1]);
    if (page == Math.floor(filteredData.length / 20) + 1) {
      document.querySelector(
        ".pagination"
      ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span><span id="next">&nbsp;</span>
      <span id="total">...${Math.floor(filteredData.length / 20)+1}</span>`;
      document
        .getElementById("previous")
        .addEventListener("click", previousPage2);
      document.getElementById("next").removeEventListener("click", nextPage2);
    }
    if (page < Math.floor(filteredData.length / 20) + 1) {
      document.querySelector(
        ".pagination"
      ).innerHTML = `<span id="previous"><</span><span id="page">${page}</span>
      <span id="next">></span><span id="total">...${Math.floor(
        filteredData.length / 20
      )+1}</span>`;
      document
        .getElementById("previous")
        .addEventListener("click", previousPage2);
      document.getElementById("next").addEventListener("click", nextPage2);
    }

  }
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'http://localhost:3000/index.html';
}