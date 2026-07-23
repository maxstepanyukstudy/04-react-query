import axios from "axios";
import type { GetMoviesResponce, Movie } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const booksApi = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export async function fetchMovies(query: string): Promise<Movie[]> {
  const { data } = await booksApi.get<GetMoviesResponce>("/3/search/movie", {
    params: {
      query,
      include_adult: false,
    },
  });
  const movies = data.results;
  return movies;
}
