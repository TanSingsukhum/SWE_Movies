import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

function App() {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const apiKey = "617dd89da10f8a19d0808e67a8203217";
  const popular = "https://api.themoviedb.org/3/movie/popular";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${popular}?api_key=${apiKey}`).then((response) => {
      const result = response.data.results;
      setMovies(result);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovies = movies.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
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
