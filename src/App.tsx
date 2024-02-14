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
  const herokuEndpoint = "https://cs361-movie-microservice-cdc35fc37d51.herokuapp.com/movie/"; //Partner's microservice

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${genresEndpoint}?api_key=${apiKey}`).then((response) => {
      const genres = response.data.genres;
      setGenres(genres);
    });

    axios.get(`${allMoviesEndpoint}?api_key=${apiKey}`).then((response) => {
      const result = response.data.results;
      setMovies(result);
    }).catch((error: AxiosError) => {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
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

  const fetchOverview = async (movieId: number) => {
    try {
      const response = await axios.get(`${herokuEndpoint}${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching overview:", error);
      return { overview: "Overview not available" };
    }
  };

  const updateMoviesWithOverview = async () => {
    const updatedMovies = await Promise.all(
      movies.map(async (movie) => {
        const overviewData = await fetchOverview(movie.id);
        return { ...movie, overview: overviewData.overview };
      })
    );
    setMovies(updatedMovies);
  };

  useEffect(() => {
    updateMoviesWithOverview();
  }, [movies]);

  const filteredMovies = movies
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => releaseYearFilter ? item.release_date.includes(releaseYearFilter) : true)
    .filter((item) => categoryFilter ? item.genre_ids.includes(categoryFilter) : true);

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
          <p>ID: {item.id}</p>
          {item.poster_path && (
            <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={`${item.title} Poster`} />
          )}
          <p>Release Date: {item.release_date}</p>
          <p>Overview: {item.overview}</p> 
        </div>
      ))}
    </div>
  );
}

export default App;