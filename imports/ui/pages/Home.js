import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Container } from 'semantic-ui-react';
import Calendrier from './home/Calendrier';
import Reservation from './home/Reservation';
import Utilisateurs from './home/Utilisateurs';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Bookings } from '../../api/bookings';

const AdminRoute = ({ isAdmin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return isAdmin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/home',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { redirectToLogin: false };
  }
  logout = () => {
    Meteor.logout(err => {
      this.setState({ redirectToLogin: true });
    });
  };
  render() {
    if (this.state.redirectToLogin) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: '/home' }
          }}
        />
      );
    }
    const { match, location, currentUser, bookings } = this.props;
    return (
      <div>
        <Navbar match={match} location={location} onLogout={this.logout} />
        <Container>
          <Switch>
            <Route path={`${match.url}/calendrier`} component={Calendrier} />
            <Route path={`${match.url}/reservation`} component={Reservation} />
            <AdminRoute
              isAdmin={this.props.isAdmin}
              path={`${match.url}/utilisateurs`}
              component={Utilisateurs}
            />
            <Redirect to={`${match.url}/calendrier`} />
          </Switch>
        </Container>
      </div>
    );
  }
}
export default withTracker(() => {
  const isAdmin = Roles.userIsInRole(
    Meteor.userId(),
    ['admin'],
    Roles.GLOBAL_GROUP
  );
  return {
    isAdmin
  };
})(Home);
