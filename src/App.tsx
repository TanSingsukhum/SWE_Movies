import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
  rating: number; // New property for movie rating
  runtime: number; // Add this property for movie runtime

}

interface Genre {
  id: number;
  name: string;
}

function App() {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [releaseYearFilter, setReleaseYearFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false); 
  const [selectedMovie, setSelectedMovie] = useState<Movies | null>(null);
  const [showPlayButton, setShowPlayButton] = useState<boolean>(false);
  const apiKey = "617dd89da10f8a19d0808e67a8203217";
  const allMoviesEndpoint = "https://api.themoviedb.org/3/movie/now_playing";
  const genresEndpoint = "https://api.themoviedb.org/3/genre/movie/list";
  const herokuEndpoint = "https://cs361-movie-microservice-cdc35fc37d51.herokuapp.com/movie/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch genres
      const genresResponse = await axios.get(`${genresEndpoint}?api_key=${apiKey}`);
      const genres = genresResponse.data.genres;
      setGenres(genres);
  
      // Fetch movies with ratings
      const moviesResponse = await axios.get(`${allMoviesEndpoint}?api_key=${apiKey}`);
      const moviesData = moviesResponse.data.results;
  
      // Fetch ratings for each movie
      const moviesWithRatingsAndRuntime = await Promise.all(
        moviesData.map(async (movie: Movies) => {
          const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`);
          const rating = detailsResponse.data.vote_average;
          const runtime = detailsResponse.data.runtime;
      
          // Combine movie data with rating and runtime
          return { ...movie, rating, runtime };
        })
      );
      
      setMovies(moviesWithRatingsAndRuntime);
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request data:", error.request);
        }
      } 
    }
  };
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReleaseYearFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReleaseYearFilter(e.target.value === 'All' ? null : e.target.value);
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value === 'All' ? null : parseInt(e.target.value));
  };

  const handleMovieClick = (movie: Movies) => {
    setSelectedMovie(movie);
  };

  const closeBanner = () => {
    setSelectedMovie(null);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const filteredMovies = movies
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => releaseYearFilter ? item.release_date.includes(releaseYearFilter) : true)
    .filter((item) => categoryFilter ? item.genre_ids.includes(categoryFilter) : true);

  const releaseYears = Array.from(
    new Set(movies.map((item) => item.release_date.split('-')[0]))
  );

  return (
    <div className="App">
      <h1 className="pageTitle">Enjoy Movie</h1>

      <button className="questionButton" onClick={toggleInstructions}>
        ?
      </button>

      {showInstructions && (
        <div className="instructionBanner">
        <h1>Welcome to Enjoy Movie!</h1>
        <p>Explore the latest and most popular movies in real-time using the TMDB API on this website!</p>
        <h2>Benefits</h2>
        <p>Discover the advantages of using this platform, where you receive up-to-date recommendations for current popular movies from TMDB. Easily search through the list and utilize filters for a personalized experience.</p>
        <h3>Important</h3>
        <p>Ensuring an enjoyable and informative experience is crucial. Our application is designed to provide accurate information and a user-friendly interface for your convenience.</p>
         
          <button onClick={toggleInstructions}>Close</button>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          id="search"
          placeholder="Enter movie title"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="filter-container">
        <label htmlFor="releaseYear">Release Year: </label>
        <select
          id="releaseYear"
          value={releaseYearFilter || 'All'}
          onChange={handleReleaseYearFilter}
        >
          <option value="All">All</option>
          {releaseYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="category">Category: </label>
        <select
          id="category"
          value={categoryFilter || 'All'}
          onChange={handleCategoryFilter}
        >
          <option value="All">All</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      {filteredMovies.map((item) => (
  <div className="movieContainer" key={item.id} onClick={() => handleMovieClick(item)}>
    <h2>{item.title}</h2>
    {item.poster_path && (
      <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={`${item.title} Poster`} />
    )}
    <p>Release Date: {item.release_date}</p>
    <p>Rating: {item.rating.toFixed(1)}/10</p> {/* Display the rating out of 10 with one decimal place */}
  </div>
))}

{selectedMovie && (
  <div className="banner" onClick={closeBanner}>
    <h2>{selectedMovie.title}</h2>
    {selectedMovie.poster_path && (
      <img src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`} alt={`${selectedMovie.title} Poster`} />
    )}
    <p>Release Date: {selectedMovie.release_date}</p>
    <p>Overview: {selectedMovie.overview}</p>
    <p>Rating: {selectedMovie.rating.toFixed(1)}/10</p>
    <p>Runtime: {selectedMovie.runtime} minutes</p> {/* Display the runtime */}
  </div>
)}

    </div>
  );
}

export default App;
