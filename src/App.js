import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]) 

  async function fetchMoviedHandler() {
    const response = await fetch('https://swapi.dev/api/films/')
    const data = await response.json()
    const transformedMovies = data.results.map(moviedData => {
      return {
        id: moviedData.episode_id,
        title: moviedData.title,
        openingText: moviedData.opening_crawl,
        releaseDate: moviedData.release_date

      };
    })
    setMovies(transformedMovies);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviedHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
