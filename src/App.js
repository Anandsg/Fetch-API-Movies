import React, { useState, useEffect } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();

      const transformedMovies = data.results.map(moviedData => {
        return {
          id: moviedData.episode_id,
          title: moviedData.title,
          openingText: moviedData.opening_crawl,
          releaseDate: moviedData.release_date,
        };
      });
      setMovies(transformedMovies);
      setRetrying(false); // Reset retrying state on successful fetch
    } catch (error) {
      setError('Something went wrong... Retrying');
      if (retrying) {
        setTimeout(fetchMoviesHandler, 5000); // Retry after 5 seconds
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (retrying) {
      fetchMoviesHandler();
    }
  }, [retrying]);

  const handleRetryClick = () => {
    setRetrying(true);
  };

  const handleCancelClick = () => {
    setRetrying(false);
    setError(null);
  };

  let content = <p>Found no movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying ? (
          <button onClick={handleCancelClick}>Cancel</button>
        ) : (
          <button onClick={handleRetryClick}>Retry</button>
        )}
      </div>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
