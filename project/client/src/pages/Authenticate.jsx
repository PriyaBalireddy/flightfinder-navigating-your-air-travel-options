import React, { useState, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Authenticate.css';

const Authenticate = () => {
  const {
    login,
    register,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    usertype,
    setUsertype
  } = useContext(GeneralContext);

  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      register();
    }
  };

  return (
    <div className="AuthenticatePage">
      <form className="authForm" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <>
            <div className="authFormInputs">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="authFormInputs">
              <label>User Type</label>
              <select
                value={usertype}
                onChange={(e) => setUsertype(e.target.value)}
                required
              >
                <option value="">Select user type</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="flight-operator">Flight Operator</option>
              </select>
            </div>
          </>
        )}

        <div className="authFormInputs">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="authFormInputs">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>

        <p>
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Register</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Authenticate;
