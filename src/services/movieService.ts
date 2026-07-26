import axios from "axios";
import type { Movie } from "../types/movie";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface GetMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const moviesApi = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export async function fetchMovies(
  query: string,
  page: number,
): Promise<GetMoviesResponse> {
  const { data } = await moviesApi.get<GetMoviesResponse>("/3/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
    },
  });
  return data;
}
