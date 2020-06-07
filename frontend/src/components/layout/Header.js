import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

class Header extends Component {
  render() {
      const { user, isAuthenticated } = this.props.auth;
      const isSuperUser = this.props.is_super_user;

      const superUserLinks = (
          <div className='right menu'>
          <Link className='item' to="/">Home</Link>
          <Link className='item' to="/job/">Job</Link>
          <Link className='item' to="/new/">Create Candidate</Link>
            <div className='ui simple dropdown item'>
              {user ? user.username : ''}
              <i className='dropdown icon' />
              <div className='menu'>
                <a onClick={this.props.logout} className='item'>Logout</a>
              </div>
            </div>
          </div>
        );

      const candidateLinks = (
          <div className='right menu'>
          <Link className='item' to="/apply">Apply</Link>
            <div className='ui simple dropdown item'>
              {user ? user.username : ''}
              <i className='dropdown icon' />
              <div className='menu'>
                <a onClick={this.props.logout} className='item'>Logout</a>
              </div>
            </div>
          </div>
      );

      const guestLinks = (
          <div className='right menu'>
            <Link to='/register' className='item'>Sign Up</Link>
            <Link to='/login' className='item'>Login</Link>

          </div>
        );

    return (
      <div className='ui inverted menu' style={{ borderRadius: '0' }}>
            <a className='ui header olive item'>InstATS APP</a>
            {/*<Link className='ui header olive item' to="/">InstATS App</Link>*/}
            {isAuthenticated ? (isSuperUser ? superUserLinks: candidateLinks)
                : guestLinks}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth,
    is_super_user: state.auth.is_super_user
});

export default connect(
  mapStateToProps,
  { logout }
)(Header);