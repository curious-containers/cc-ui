import React from 'react';
import { Link } from 'react-router';
import Login from './Login';
import { api } from './Api';
import { autologin, credentials } from './config.js';


export default React.createClass({

  propTypes: {
    children: React.PropTypes.object,
  },

  getInitialState() {
    return {
      loggedIn: true,
      loginMessage: '',
      errorMessage: '',
    };
  },

  componentWillMount() {
    api.on('sessionEnded', () => this.setState({
      loggedIn: false,
      loginMessage: 'No valid session found',
    }));

    api.on('error', (error = {}) => this.setState({
      errorMessage: error.message || error.statusText || 'An unknown error occurred',
    }));

    if (!this.props.children) {
      api.checkLogin()
        .then(loggedIn => this.setState({ loggedIn }));
    }
  },

  handleLogin() {
    this.setState({
      loggedIn: true,
      loginMessage: '',
    });
  },

  handleLogout() {
    this.setState({
      loggedIn: false,
    });
  },

  renderContent() {
    if (this.state.errorMessage) {
      return (
        <div className="alert alert-error m-b-2">
          <strong>Error</strong> {this.state.errorMessage} <a href="/" className="pull-right">Reload</a>
        </div>
      );
    }

    if (!this.state.loggedIn) {
      return (
        <Login
          onSubmit={this.handleLogin}
          credentials={credentials}
          autologin={autologin}
          message={this.state.loginMessage}
        />
      );
    }

    return this.props.children;
  },

  render() {
    return (
      <div className="container">
        <header className="site-header dashed-bottom">
          <Link to="/" className="site-title">CC</Link>
          <nav className="responsive-nav">
            <label htmlFor="navigation-toggle">≡</label>
          </nav>
          <input type="checkbox" id="navigation-toggle" />
          <nav className="site-nav nav-separated">
            <ul>
              <li><Link activeClassName="active" to="/task-groups">Task Groups</Link></li>
              <li><Link activeClassName="active" to="/tasks">Tasks</Link></li>
              <li><Link activeClassName="active" to="/application-containers">App Containers</Link></li>
              <li><Link activeClassName="active" to="/data-containers">Data Containers</Link></li>
              <li><Link activeClassName="active" to="/cluster">Cluster</Link></li>
              {this.state.loggedIn && <li><Link to="/" onClick={api.logout}>Logout</Link></li>}
            </ul>
          </nav>
        </header>

        <main className="site-main">
          {this.renderContent()}
        </main>

        <footer className="site-footer dashed-top">
          <a href="https://www.curious-containers.cc/">curious-containers.cc</a> – <a href="https://github.com/curious-containers">Github</a>
        </footer>
      </div>
    );
  },

});
