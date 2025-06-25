import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [ticketBookingDate, setTicketBookingDate] = useState();

  const [currentUser, setCurrentUser] = useState(null); // ✅ key to trigger UI updates

  const navigate = useNavigate();

  // Load user from localStorage on first load
  useEffect(() => {
    const storedUser = {
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      usertype: localStorage.getItem('userType'),
    };

    if (storedUser.userId) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = async () => {
    try {
      const loginInputs = { email, password };
      await axios.post('http://localhost:6001/login', loginInputs)
        .then((res) => {
          localStorage.setItem('userId', res.data._id);
          localStorage.setItem('userType', res.data.usertype);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('email', res.data.email);

          const newUser = {
            userId: res.data._id,
            username: res.data.username,
            email: res.data.email,
            usertype: res.data.usertype,
          };

          setCurrentUser(newUser); // ✅ trigger update

          if (res.data.usertype === 'customer') {
            navigate('/');
          } else if (res.data.usertype === 'admin') {
            navigate('/admin');
          } else if (res.data.usertype === 'flight-operator') {
            navigate('/flight-admin');
          }
        }).catch((err) => {
          alert("Login failed!");
          console.log(err);
        });

    } catch (err) {
      console.log(err);
    }
  };

  const register = async () => {
    try {
      const inputs = { username, email, usertype, password };
      await axios.post('http://localhost:6001/register', inputs)
        .then((res) => {
          localStorage.setItem('userId', res.data._id);
          localStorage.setItem('userType', res.data.usertype);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('email', res.data.email);

          const newUser = {
            userId: res.data._id,
            username: res.data.username,
            email: res.data.email,
            usertype: res.data.usertype,
          };

          setCurrentUser(newUser); // ✅ update context

          if (res.data.usertype === 'customer') {
            navigate('/');
          } else if (res.data.usertype === 'admin') {
            navigate('/admin');
          } else if (res.data.usertype === 'flight-operator') {
            navigate('/flight-admin');
          }
        }).catch((err) => {
          alert("Registration failed!");
          console.log(err);
        });

    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null); // ✅ clear context user
    navigate('/');
  };

  return (
    <GeneralContext.Provider value={{
      username, setUsername,
      email, setEmail,
      password, setPassword,
      usertype, setUsertype,
      ticketBookingDate, setTicketBookingDate,
      login, register, logout,
      currentUser, // ✅ expose current user
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
