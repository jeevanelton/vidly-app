import React, { useState } from "react";
import Joi from "joi-browser";
import Input from "./common/Input";

const RegisterForm = () => {
  const [data, setData] = useState({ username: "", password: "", name: "" });
  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().min(3).required().label("Password"),
    name: Joi.string().required().label("Name"),
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          value={data.username}
          label="Username"
          type="email"
          error={errors.username}
          onChange={(e) => handleChange(e)}
        />

        <Input
          name="password"
          value={data.password}
          label="Password"
          type="password"
          error={errors.password}
          onChange={(e) => handleChange(e)}
        />
        <Input
          name="name"
          value={data.name}
          label="Name"
          type="text"
          error={errors.name}
          onChange={(e) => handleChange(e)}
        />
        <button disabled={validate()} className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
