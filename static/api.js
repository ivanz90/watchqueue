//ovaj deo koda koristim kako bih preuzeo playliste sa API-ja, smestam u JSON file, a zatim brisem nepotrebne filmove
const apiUrl = "https://api.themoviedb.org/3/";
const apiKey = "10124ffdfa7546a35865493a550a4cb9";
const marvelUrl =
  "https://api.themoviedb.org/3/discover/movie?api_key=10124ffdfa7546a35865493a550a4cb9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_companies=420&with_watch_monetization_types=flatrate";

async function showMarvel(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data)
      const movies = data.results.map((movie) => ({
        title: movie.title,
        releaseYear: movie.release_date.substring(0, 4),
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }));
      const marvelPlaylist = { name: "Marvel Movies", movies };
      const jsonData = { playlists: [marvelPlaylist] };
      const jsonString = JSON.stringify(jsonData, null, 2);
      // console.log(jsonString);
    });
}

showMarvel(marvelUrl);

const playlists = [
  {
    name: "Harry Potter marathon",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "harry potter",
    }),
  },
  {
    name: "LOTR+Hobbit",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "hobbit",
    }),
  },
  {
    name: "Star Wars all movies",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "star wars",
    }),
  },
  {
    name: "Matrix all movies",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "matrix",
    }),
  },
  {
    name: "Twilight all movies",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "twilight",
    }),
  },
  {
    name: "John Wick all movies",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "john wick",
    }),
  },
  {
    name: "all Batman movies",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "batman",
    }),
  },
  {
    name: "Pirates of the Caribbean",
    searchParams: new URLSearchParams({
      api_key: apiKey,
      query: "Pirates of the Caribbean",
    }),
  },
];

Promise.all(
  playlists.map((playlist) =>
    fetch(apiUrl + "search/movie?" + playlist.searchParams.toString())
      .then((response) => response.json())
      .then((data) => ({
        name: playlist.name,
        movies: data.results.map((movie) => ({
          title: movie.title,
          year: parseInt(movie.release_date),
          image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        })),
      }))
  )
)
  .then((playlistData) => {
    const jsonData = { playlists: playlistData };
    const jsonString = JSON.stringify(jsonData, null, 2);
    //console.log(jsonString);
  })
  .catch((error) => {
    console.error("Error retrieving playlist data: ", error);
  });