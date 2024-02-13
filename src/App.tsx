import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
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
  const apiKey = "617dd89da10f8a19d0808e67a8203217";
  const allMoviesEndpoint = "https://api.themoviedb.org/3/movie/now_playing";
  const genresEndpoint = "https://api.themoviedb.org/3/genre/movie/list";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch genres to populate category filter
    axios.get(`${genresEndpoint}?api_key=${apiKey}`).then((response) => {
      const genres = response.data.genres;
      setGenres(genres);
    });

    // Fetch movies
    axios.get(`${allMoviesEndpoint}?api_key=${apiKey}`).then((response) => {
      const result = response.data.results;
      setMovies(result);
    }).catch((error: AxiosError) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    });
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

  const filteredMovies = movies
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => releaseYearFilter ? item.release_date.includes(releaseYearFilter) : true)
    .filter((item) => categoryFilter ? item.genre_ids.includes(categoryFilter) : true);

  // Get unique release years for the release year filter dropdown
  const releaseYears = Array.from(
    new Set(movies.map((item) => item.release_date.split('-')[0]))
  );

  return (
    <div className="App">
      <div className="search-container">
        <label htmlFor="search">Search: </label>
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

        {/* Assuming you have a list of genres (genre IDs) to populate the category filter */}
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
        <div className="movieContainer" key={item.id}>
          <h2>{item.title}</h2>
          {item.poster_path && (
            <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={`${item.title} Poster`} />
          )}
          <p>{item.release_date}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
