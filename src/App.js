import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);



  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://movie-http-60891-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      // console.log(data);

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      setMovies(loadedMovies);
      setRetrying(false); // Reset retrying state on successful fetch
    } catch (error) {
      setError('Something went wrong... Retrying');
      if (retrying) {
        setTimeout(fetchMoviesHandler, 5000); // Retry after 5 seconds
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

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


  async function addMovieHandler(movie) {
    const response = await fetch('https://movie-http-60891-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json()
    console.log(data)
  }

  let content = <p>Found no movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  async function deleteMovieHandler(movieId) {
    try {
      const response = await fetch(
        `https://movie-http-60891-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong while deleting the movie.');
      }

      // Update movies state by removing the deleted movie
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error(error);
    }
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
      <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
