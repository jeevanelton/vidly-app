import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import Input from "./common/Input";
import { getGenres } from "../services/fakeGenreService";
import { getMovie, saveMovie } from "../services/fakeMovieService";
import Select from "./common/Select";

const MovieForm = ({ match, history }) => {
  const [data, setData] = useState({
    title: "",
    genreId: "",
    numberInStock: "",
    dailyRentalRate: "",
  });

  const [genres, setGenre] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const genres = getGenres();
    setGenre(genres);

    const movieId = match.params.id;
    if (movieId === "new") return;

    const movie = getMovie(movieId);
    if (!movie) return history.replace("/notfound");

    setData(mapToViewModel(movie));
  }, [match.params.id, history]);

  const mapToViewModel = (movie) => {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  };

  const schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).max(100).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  };

  const validate = () => {
    const result = Joi.validate(data, schema, { abortEarly: false });
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  const validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const inputSchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, inputSchema);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = validate();
    setErrors(val);

    saveMovie(data);
    history.push("/movies");
  };

  const handleChange = ({ target: input }) => {
    const inputErrors = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) inputErrors[input.name] = errorMessage;
    else delete inputErrors[input.name];

    const inputData = { ...data };
    inputData[input.name] = input.value;
    setErrors(inputErrors);
    setData(inputData);
  };

  return (
    <div>
      <h1>Movie Form</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Input
          name="title"
          value={data.title}
          label="Title"
          type="text"
          error={errors.title}
          onChange={(e) => handleChange(e)}
        />
        <Select
          name="genreId"
          value={data.genreId}
          label="Genre"
          options={genres}
          onChange={(e) => handleChange(e)}
          error={errors.genreId}
        />
        <Input
          name="numberInStock"
          value={data.numberInStock}
          label="Number in Stock"
          type="number"
          error={errors.numberInStock}
          onChange={(e) => handleChange(e)}
        />
        <Input
          name="dailyRentalRate"
          value={data.dailyRentalRate}
          label="Rate"
          type="number"
          error={errors.dailyRentalRate}
          onChange={(e) => handleChange(e)}
        />

        <button disabled={validate()} className="btn btn-primary" type="submit">
          save
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
