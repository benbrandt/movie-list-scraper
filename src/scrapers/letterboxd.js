// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const take = require("ramda/src/take");

const topMoviesUrl = page =>
  `http://letterboxd.com/films/ajax/by/rating/size/small/page/${page}/`;

async function getMovieList(url): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(url, {
    movies: {
      listItem: ".film-poster",
      data: {
        title: {
          attr: "data-film-name"
        },
        year: {
          attr: "data-film-release-year",
          convert: x => parseInt(x)
        }
      }
    }
  });

  return movies;
}

async function getTopMovies(): Promise<SearchInfo[]> {
  const movies1 = await getMovieList(topMoviesUrl(1));
  const movies2 = await getMovieList(topMoviesUrl(2));

  const movies = [...movies1, ...movies2];
  return take(100, movies);
}

getTopMovies();

module.exports = { getTopMovies };
