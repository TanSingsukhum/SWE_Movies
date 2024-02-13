// MoviesPage.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Movies {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
}

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  // ... your existing code for fetching and filtering movies

  return (
    <div className="movies-page">
      {/* ... your existing code for displaying movies */}
    </div>
  );
};

export default MoviesPage;
