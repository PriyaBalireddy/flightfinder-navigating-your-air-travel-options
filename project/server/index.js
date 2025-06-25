import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { connect } from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User, Booking, Flight } from './schemas.js';

const app = express();
const PORT = 6001;

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Basic root route
app.get('/', (req, res) => {
  res.send("Server is live!");
});

// MongoDB Connection
mongoose.connect('mongodb+srv://balireddypriya957:fPZ7HuGHrvKt8SGq@cluster0.ginmkvr.mongodb.net/MERN?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully!');
}).catch((e) => console.log(`Error in DB connection: ${e}`));

// ========== ROUTES ==========

// Register
app.post('/register', async (req, res) => {
  const { username, email, usertype, password } = req.body;
  let approval = 'approved';
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    if (usertype === 'flight-operator') approval = 'not-approved';

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, usertype, password: hashedPassword, approval });
    const userCreated = await newUser.save();
    res.status(201).json(userCreated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Approve Operator
app.post('/approve-operator', async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    user.approval = 'approved';
    await user.save();
    res.json({ message: 'approved!' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Reject Operator
app.post('/reject-operator', async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    user.approval = 'rejected';
    await user.save();
    res.json({ message: 'rejected!' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Fetch Single User
app.get('/fetch-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Fetch All Users
app.get('/fetch-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Add Flight
app.post('/add-flight', async (req, res) => {
  const { flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
  try {
    const flight = new Flight({ flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats });
    await flight.save();
    res.json({ message: 'flight added' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Flight creation failed' });
  }
});

// Update Flight
app.put('/update-flight', async (req, res) => {
  const { _id, flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
  try {
    const flight = await Flight.findById(_id);
    Object.assign(flight, { flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats });
    await flight.save();
    res.json({ message: 'flight updated' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Flight update failed' });
  }
});

// Fetch All Flights
app.get('/fetch-flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Fetch Single Flight
app.get('/fetch-flight/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    res.json(flight);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Fetch All Bookings
app.get('/fetch-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
});

// Book Ticket
app.post('/book-ticket', async (req, res) => {
  const { user, flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, journeyTime, seatClass } = req.body;
  try {
    const bookings = await Booking.find({ flight, journeyDate, seatClass });
    const numBookedSeats = bookings.reduce((acc, booking) => acc + booking.passengers.length, 0);

    const seatCode = { 'economy': 'E', 'premium-economy': 'P', 'business': 'B', 'first-class': 'A' };
    const coach = seatCode[seatClass];
    let seats = passengers.map((_, i) => `${coach}-${numBookedSeats + i + 1}`).join(', ');

    const booking = new Booking({ user, flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, journeyTime, seatClass, seats });
    await booking.save();

    res.json({ message: 'Booking successful!!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// Cancel Ticket
app.put('/cancel-ticket/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    booking.bookingStatus = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Cancellation failed' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Running @ ${PORT}`);
}); 
// mongodb+srv://balireddypriya957:fPZ7HuGHrvKt8SGq@cluster0.ginmkvr.mongodb.net/
// mongodb+srv://balireddypriya957:fPZ7HuGHrvKt8SGq@cluster0.ginmkvr.mongodb.net/FlightBooking?retryWrites=true&w=majority&appName=Cluster0