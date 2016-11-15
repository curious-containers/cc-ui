import React from 'react';
import { api } from './Api';
import './login.css';


export default React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    credentials: React.PropTypes.object,
    autologin: React.PropTypes.bool,
    message: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
  },

  getDefaultProps() {
    return {
      credentials: {
        username: '',
        password: '',
      },
      autologin: false,
    };
  },

  getInitialState() {
    return {
      loading: false,
      message: this.props.message || '',
    };
  },

  componentDidMount() {
    if (this.props.autologin) {
      this.onSubmit();
    }
  },

  onSubmit(ev) {
    if (ev) ev.preventDefault();

    this.setState({ loading: true });

    const username = this.refs.username.value;
    const password = this.refs.password.value;

    api.login(username, password).then(
      () => {
        this.setState({ loading: false });
        this.props.onSubmit(username);
      },
      err => this.setState({
        loading: false,
        message: {
          header: 'Fehler beim Login',
          text: err.message || 'unbekannt',
          type: 'error',
        },
      })
    );
  },

  getErrorMessage() {
    const message = this.getMessage();
    if (message) {
      if (message.type === 'error') {
        const header = <strong>{message.header || 'Fehler'}</strong>;
        return <div className="alert alert-error m-b-2">{header} {message.text}</div>;
      }

      const header = message.header ? <strong>message.header</strong> : '';
      return <div className="alert alert-info m-b-2">{header} {message.text}</div>;
    }
    return '';
  },

  getMessage() {
    const message = this.state.message;

    if (!message) { return false; }

    if (typeof message === 'string') {
      return {
        text: message,
        type: 'normal',
      };
    }
    return message;
  },

  render() {
    const title = 'Bitte Zugangsdaten eingeben';
    const { username, password } = this.props.credentials;

    return (
      <div className="login-panel">
        <h1 className="pure">{title}</h1>

        {this.getErrorMessage()}

        <form className="form" onSubmit={this.onSubmit}>
          <label className="form-group">
            <input className="form-control" name="username" placeholder="Username" required defaultValue={username} ref="username" />
            <span className="form-label">Username</span>
          </label>
          <label className="form-group">
            <input className="form-control" name="password" type="password" placeholder="Password" required defaultValue={password} ref="password" />
            <span className="form-label">Password</span>
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            Einloggen {this.state.loading && <span className="loading" />}
          </button>
        </form>
      </div>
    );
  },

});
