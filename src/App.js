import React from 'react';
import './App.css';
import Movies from './components/Movies';
import NavBar from './components/NavBar';
import { Switch, Route, Redirect } from 'react-router-dom';
import Rentals from './components/Rentals';
import Customers from './components/Customers';
import NotFound from './components/NotFound';
import MovieForm from './components/MovieForm';
import loginForm from './components/loginForm';
import RegisterForm from './components/RegisterForm';



function App() {

  return (
    <React.Fragment>
      <NavBar />
      <main className="App">
        <Switch>

          <Route path='/register' component={RegisterForm} />
          <Route path='/login' component={loginForm} />
          <Route path='/movies/:id' component={MovieForm} />
          <Route path='/rentals' component={Rentals} />
          <Route path='/customers' component={Customers} />
          <Route path='/movies' component={Movies} />
          <Route path='/notfound' component={NotFound} />
          <Redirect exact from='/' to='/movies' />
          <Redirect to='/notfound' />
        </Switch>

      </main>
    </React.Fragment>
  );
}

export default App;
