import React, { useState } from "react";
import Input from "./common/Input";
import Joi from "joi-browser";

const LoginForm = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
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
    console.log(data);
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
      <h1>login</h1>
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

        <button disabled={validate()} className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
