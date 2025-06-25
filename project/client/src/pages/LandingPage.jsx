import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const currentYear = new Date().getFullYear();

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const navigate = useNavigate();
  const [Flights, setFlights] = useState([]);
  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'admin') navigate('/admin');
    else if (userType === 'flight-operator') navigate('/flight-admin');
  }, []);

  const fetchFlights = async () => {
    const today = new Date();
    const start = new Date(departureDate);
    const end = new Date(returnDate);

    if (!departure || !destination || !departureDate || (checkBox && !returnDate)) {
      return setError('Please fill all the inputs');
    }

    if (checkBox && (start <= today || end <= start)) {
      return setError('Please check the dates');
    }

    if (!checkBox && start < today) {
      return setError('Please check the dates');
    }

    setError('');
    const res = await axios.get('http://localhost:6001/fetch-flights');
    setFlights(res.data);
  };

  const handleTicketBooking = (id, origin, destination) => {
    if (!userId) return navigate('/auth');

    const selectedDate = origin === departure ? departureDate : returnDate;
    setTicketBookingDate(selectedDate);
    navigate(`/book-flight/${id}`);
  };

  return (
    <div className="landingPage">

      <div className="landingHero">
        <div className="Flight-search-container input-container mb-4">
          <div className="search-header">
            <h2>Plan Your Journey</h2>
            <p>Choose your cities and travel dates to search available flights.</p>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={(e) => setCheckBox(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Return journey
            </label>
          </div>

          <div className="Flight-search-container-body">
            <div className="column">
              <div className="form-floating">
                <select
                  className="form-select form-select-sm mb-3"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Banglore">Banglore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Indore">Indore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Trivendrum">Trivendrum</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="varanasi">Varanasi</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
                <label htmlFor="floatingSelect">Departure City</label>
              </div>

              <div className="form-floating">
                <select
                  className="form-select form-select-sm mb-3"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Banglore">Banglore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Indore">Indore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Trivendrum">Trivendrum</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="varanasi">Varanasi</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
                <label htmlFor="floatingSelect">Destination City</label>
              </div>
            </div>

            <div className="column">
              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="floatingInputstartDate"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
                <label htmlFor="floatingInputstartDate">Journey Date</label>
              </div>

              {checkBox && (
                <div className="form-floating mb-3">
                  <input
                    type="date"
                    className="form-control"
                    id="floatingInputreturnDate"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                  <label htmlFor="floatingInputreturnDate">Return Date</label>
                </div>
              )}
            </div>
          </div>

          <div className="search-button-container">
            <button className="btn btn-primary" onClick={fetchFlights}>
              Search Flights
            </button>
          </div>

          <p className="error-text">{error}</p>
        </div>

        {Flights.length > 0 && (
          Flights.filter(f => f.origin === departure && f.destination === destination).length > 0 ? (
            <div className="availableFlightsContainer">
              <h1>Available Flights</h1>
              <div className="Flights">
                {Flights
                  .filter(f => checkBox
                    ? (f.origin === departure && f.destination === destination) || (f.origin === destination && f.destination === departure)
                    : f.origin === departure && f.destination === destination)
                  .map(flight => (
                    <div className="Flight" key={flight._id}>
                      <div>
                        <p><b>{flight.flightName}</b></p>
                        <p><b>Flight Number:</b> {flight.flightId}</p>
                      </div>
                      <div>
                        <p><b>Start:</b> {flight.origin}</p>
                        <p><b>Departure:</b> {flight.departureTime}</p>
                      </div>
                      <div>
                        <p><b>Destination:</b> {flight.destination}</p>
                        <p><b>Arrival:</b> {flight.arrivalTime}</p>
                      </div>
                      <div>
                        <p><b>Price:</b> ₹{flight.basePrice}</p>
                        <p><b>Seats:</b> {flight.totalSeats}</p>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleTicketBooking(flight._id, flight.origin, flight.destination)}>Book Now</button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="availableFlightsContainer">
              <h1>No Flights</h1>
            </div>
          )
        )}
      </div>

      <section id="about" className="section-about p-4">
  <div className="container">
    <h2 className="section-title">About Us</h2>
    <p className="section-description">
      Welcome to <strong>FlightFinder</strong>, your modern travel companion for seamless flight booking. Our platform simplifies the way you search, compare, and reserve flights by offering smart technology, intuitive design, and reliable results—all in one place. Whether you're planning a quick trip or a long journey, SkySwift helps you take off with confidence.
    </p>
    <span><h5>{currentYear} FlightFinder – All rights reserved</h5></span>
  </div>
</section>

    </div>
  );
};

export default LandingPage;
