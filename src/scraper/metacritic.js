// @flow
import type { SearchInfo } from "../types";
const scrapeIt = require("scrape-it");
const R = require("ramda");

const topMoviesUrl =
  "http://www.metacritic.com/browse/movies/score/metascore/all";
const topTVUrl = page =>
  `http://www.metacritic.com/browse/tv/score/metascore/all?page=${page}`;

async function getTopMovies(): Promise<SearchInfo[]> {
  const { movies }: { movies: SearchInfo[] } = await scrapeIt(topMoviesUrl, {
    movies: {
      listItem: ".list.score .summary_row",
      data: {
        title: {
          selector: ".title_wrapper .title a"
        },
        year: {
          selector: ".date_wrapper span:first-child",
          convert: x => parseInt(x.slice(-4))
        }
      }
    }
  });

  return R.take(100, movies);
}

async function getTopShowList(url): Promise<SearchInfo[]> {
  const { shows }: { shows: SearchInfo[] } = await scrapeIt(url, {
    shows: {
      listItem: ".product_rows .product_row.season",
      data: {
        title: {
          selector: ".product_item.product_title a",
          convert: x => x.split(": Season")[0]
        }
      }
    }
  });

  return R.uniq(shows);
}

async function getTopShows(): $await<SearchInfo[]> {
  let shows = [];
  const pages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let page of pages) {
    const list = await getTopShowList(topTVUrl(page));
    if (!list.length) console.log(`Page ${page} failed.`);
    shows.push(list);
  }

  return R.take(100, R.uniq(R.flatten(shows)));
}

module.exports = { getTopMovies, getTopShows };
