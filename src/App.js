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
      loggedIn: false,
      loginMessage: '',
    };
  },

  componentWillMount() {
    api.on('sessionEnded', () => this.setState({
      loggedIn: false,
      loginMessage: 'Session abgelaufen',
    }));

    api.checkLogin()
      .then(loggedIn => this.setState({ loggedIn }));
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
          <Link to="/" className="site-title">Curious Containers</Link>
          <nav className="responsive-nav">
            <label htmlFor="navigation-toggle">≡</label>
          </nav>
          <input type="checkbox" id="navigation-toggle" />
          <nav className="site-nav">
            <ul>
              <li><Link to="/task-groups">Task Groups</Link></li>
              <li><Link to="/tasks">Tasks</Link></li>
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
