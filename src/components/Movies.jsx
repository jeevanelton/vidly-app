import React, { useState } from "react";
import { getMovies } from "../services/fakeMovieService";
import Pagnation from "./common/Pagnation";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/ListGroup";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./MoviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";

const Movies = () => {
  const [movies, setMovies] = useState(getMovies());
  const [genres] = useState([{ _id: "", name: "All Genres" }, ...getGenres()]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });

  const handleDelete = (_id) => {
    const deleteMovie = movies.filter((movie) => _id !== movie._id);
    setMovies(deleteMovie);
  };

  const handleLike = (movie) => {
    const likeMovie = [...movies];
    const index = movies.indexOf(movie);
    likeMovie[index] = { ...movie };
    likeMovie[index].like = !likeMovie[index].like;
    setMovies(likeMovie);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSort = (sortedColumn) => {
    setSortColumn({ ...sortedColumn });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setCurrentPage(1);
  };

  const getPageData = () => {
    let filtered = movies;
    if (searchQuery)
      filtered = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = movies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const allMovies = paginate(sorted, currentPage, pageSize);
    return { filtered, allMovies };
  };

  if (movies.length === 0) return <p>There are no movies in the database</p>;

  const { filtered, allMovies } = getPageData();

  return (
    <div className="row">
      <div className="col-2">
        <ListGroup
          items={genres}
          selectedItem={selectedGenre}
          onItemSelect={handleGenreSelect}
        />
      </div>
      <div className="col">
        <Link to="/movies/new">
          <button className="btn btn-primary m-2">New Movie</button>
        </Link>

        <p>{`showing ${filtered.length} in the database`}</p>
        <SearchBox value={searchQuery} onChange={handleSearch} />
        <MoviesTable
          movies={allMovies}
          onLike={handleLike}
          onDelete={handleDelete}
          onSort={handleSort}
          sortColumn={sortColumn}
        />
        <Pagnation
          onPageChange={handlePageChange}
          itemsCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Movies;
