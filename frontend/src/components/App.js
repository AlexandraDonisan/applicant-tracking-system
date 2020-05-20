import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import history from '../history';

import store from '../store';
import Header from "./layout/Header";
import Dashboard from "./candidates/Dashboard";
import CandidateCreate from "./candidates/CandidateCreate";
import CandidateDelete from "./candidates/CandidateDelete";
import CandidateEdit from "./candidates/CandidateEdit";
import CandidateDetails from "./candidates/CandidateDetails"
import CandidateScore from "./candidates/CandidateScore";
import LoginForm from './auth/LoginForm'; //
import PrivateRoute from './common/PrivateRoute';
import { loadUser } from '../actions/auth';
import RegisterForm from "./auth/RegisterForm";


class App extends Component{
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
    return (
        // The Provider makes the store available to the component nested inside of it.
      <Provider store={store}>
          <Router history={history}>
                <Header />
                <Switch>
                    <PrivateRoute exact path='/' component={Dashboard} />
                    <Route exact path='/register' component={RegisterForm} />
                    <Route exact path='/login' component={LoginForm} />
                    <Route exact path='/new/' component={CandidateCreate} />
                    <Route exact path='/details/:id' component={CandidateDetails} />
                    <Route exact path='/edit/:id' component={CandidateEdit} />
                    <Route exact path='/delete/:id' component={CandidateDelete} />
                    <Route exact path='/score/:id' component={CandidateScore} />
                </Switch>
          </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));