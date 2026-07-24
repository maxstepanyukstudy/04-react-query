import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleSeqrch(query: string) {
    const handleFetchMovies = async () => {
      try {
        setMovies([]);
        setIsLoading(true);
        setIsError(false);
        const data = await fetchMovies(query);
        if (data.length < 1) {
          toast.error("No movies found for your request.");
        }
        setMovies(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    handleFetchMovies();
  }

  return (
    <>
      <SearchBar onSubmit={handleSeqrch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      <main>{movies.length > 0 && <MovieGrid movies={movies} />}</main>

      <Toaster />
    </>
  );
}
