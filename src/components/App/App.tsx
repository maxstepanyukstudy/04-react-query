import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import css from "./App.module.css";

// react-paginate setup
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
type ModuleWithDefault<T> = { default: T };
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchQuery, currentPage], //todo: currentPage
    queryFn: () => {
      return fetchMovies(searchQuery, currentPage); //todo: currentPage
    },
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data && data.results && data.results.length < 1) {
      toast.error("No movies found for your request.");
    }
  }, [data, isSuccess]);

  function handleSearch(query: string) {
    setSearchQuery(query); //todo: move to <SearchBar onSubmit={setQuery} />
  }

  function openModal(movie: Movie) {
    setModalMovie(movie);
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {modalMovie && (
        <MovieModal
          movie={modalMovie}
          onClose={() => {
            setModalMovie(null);
          }}
        />
      )}

      <main>
        {data && data.results && data.results.length > 0 && (
          <>
            {data.total_pages > 1 && (
              <ReactPaginate
                pageCount={data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected: selectedPaginationIndex }) => {
                  setCurrentPage(selectedPaginationIndex + 1);
                }}
                forcePage={currentPage - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}

            <MovieGrid movies={data.results} onSelect={openModal} />
          </>
        )}
      </main>

      <Toaster />
    </>
  );
}
