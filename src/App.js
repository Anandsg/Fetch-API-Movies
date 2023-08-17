import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([])
  const [isloading, setIsLoading] = useState(false)

  async function fetchMoviedHandler() {
    setIsLoading(true);
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
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviedHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isloading && <MoviesList movies={movies} />}
        {isloading && <p>Loadning....</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
