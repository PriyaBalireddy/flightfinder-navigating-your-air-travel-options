import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(GeneralContext);

  return (
    <div className="navbar">
      <div className="navbar-left">
  <span className="brand">FlightFinder</span>
</div>


      <div className="navbar-center">
        <Link to="/">Home</Link>

        {currentUser?.usertype === 'customer' && (
          <>
            <Link to="/flights">Flights</Link>
            <Link to="/bookings">My Bookings</Link>
          </>
        )}

        {currentUser?.usertype === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/all-users">Users</Link>
            <Link to="/all-bookings">Bookings</Link>
            <Link to="/all-flights">Flights</Link>
          </>
        )}

        {currentUser?.usertype === 'flight-operator' && (
          <>
            <Link to="/flight-admin">Manage Flights</Link>
            <Link to="/flight-bookings">My Bookings</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {!currentUser ? (
          <>
            <Link to="/auth"><button>Login</button></Link>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 'bold', color: '#fff' }}>
              {currentUser.username}
            </span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;