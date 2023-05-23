//za prikazivanje playlista u homepage
fetch("./movie-playlist.json")
  .then((res) => res.json())
  .then((data) => {
    const svePlayliste = data.playlists;
    const randomPlaylists = getRandom(svePlayliste, 5);
    let ispis = "";

    const playlistContainer = document.getElementById("playlists");
    randomPlaylists.forEach((element) => {
      ispis += ` <div class="playlist-item">
    <img src="${
      element.movies[Math.floor(Math.random() * 4)].image
    }" alt="slika1" />
    <h4>${element.name}</h4>
    <p>
        Number of movies: ${element.movies.length}
    </p>
  </div>`;
    });
    playlistContainer.innerHTML = ispis;

    //carousel
    const active = document.createElement("div");
    active.setAttribute("class", "carousel-item active");
    const nonActive1 = document.createElement("div");
    nonActive1.setAttribute("class", "carousel-item");
    const nonActive2 = document.createElement("div");
    nonActive2.setAttribute("class", "carousel-item");
    const nonActive3 = document.createElement("div");
    nonActive3.setAttribute("class", "carousel-item");
    const nonActive4 = document.createElement("div");
    nonActive4.setAttribute("class", "carousel-item");
    var randomFilmovi = new Array();
    var slikeNiz = new Array();
    var randomSlike = new Array();

    randomPlaylists.forEach((elem) => {
      randomFilmovi = getRandom(elem.movies, 4);
      randomSlike = randomFilmovi.map((movie) => {
        return `<img src="${movie.image}" alt="..." />`;
      });
      slikeNiz.push(...randomSlike);
    });

    slikeNiz.forEach((slike, index) => {
      if (index < 4) {
        active.innerHTML += ` ${slike}; <div class="carousel-caption">
        <h5>${randomPlaylists[0].name}</h5>
        <p>${randomPlaylists[0].desc}</p>`;
      } else if (index >= 4 && index < 8) {
        nonActive1.innerHTML += ` ${slike}; <div class="carousel-caption">
        <h5>${randomPlaylists[1].name}</h5>
        <p>${randomPlaylists[1].desc}</p>`;
      } else if (index >= 8 && index < 12) {
        nonActive2.innerHTML += ` ${slike}; <div class="carousel-caption">
        <h5>${randomPlaylists[2].name}</h5>
        <p>${randomPlaylists[2].desc}</p>`;
      } else if (index >= 12 && index < 16) {
        nonActive3.innerHTML += ` ${slike}; <div class="carousel-caption">
        <h5>${randomPlaylists[3].name}</h5>
        <p>${randomPlaylists[3].desc}</p>`;
      } else {
        nonActive4.innerHTML += ` ${slike}; <div class="carousel-caption">
        <h5>${randomPlaylists[4].name}</h5>
        <p>${randomPlaylists[4].desc}</p>`;
      }
    });

    document.querySelector(".carousel-inner").appendChild(active);
    document.querySelector(".carousel-inner").appendChild(nonActive1);
    document.querySelector(".carousel-inner").appendChild(nonActive2);
    document.querySelector(".carousel-inner").appendChild(nonActive3);
    document.querySelector(".carousel-inner").appendChild(nonActive4);

    //showcase desc

    //change carousel

    const playlistItem = document.querySelectorAll(".playlist-item");
    playlistItem.forEach((elem) => {
      elem.addEventListener("click", changeCarousel);
    });

    //functions
    function changeCarousel(e) {
      e.preventDefault();
      const selectedPlaylist = this.children[1].innerHTML;
      const foundPlaylist = svePlayliste.find(
        (elem) => elem.name === selectedPlaylist
      );
      let ispis = "";
      const filmovi = foundPlaylist.movies;
      const randomImages = getRandom(filmovi, 4);
      const slike = randomImages.map((elem) => {
        return `<img src="${elem.image}" alt="..." />`;
      });
      ispis += ` ${slike}; 
      <div class="carousel-caption">
      <h5>${foundPlaylist.name}</h5>
      <p>${foundPlaylist.desc}</p>`;
      document.querySelector(".active").innerHTML = ispis;
      console.log(selectedPlaylist);
      var slika = document.querySelector(".active img");
    }
  })
  .catch((error) => console.log(error.message));

function getRandom(items, count) {
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = 'http://localhost:3000/index.html';
}