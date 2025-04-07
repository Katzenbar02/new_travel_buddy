// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Optional: Suppress Mongoose strictQuery warning
mongoose.set('strictQuery', false);

// Create the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Secret key for JWT (in production, store in an env variable)
const SECRET_KEY = process.env.JWT_SECRET || 'some_secret_key';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/travelbuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// -----------------------------
// Destination Model
// -----------------------------
const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pictures: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length === 3;
      },
      message: 'Please provide exactly 3 pictures.'
    }
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  }
});
DestinationSchema.index({ location: '2dsphere' });

const Destination = mongoose.model('Destination', DestinationSchema);

// -----------------------------
// User Model
// -----------------------------
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// -----------------------------
// Itinerary Model
// -----------------------------
const ItinerarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
  createdAt: { type: Date, default: Date.now }
});
const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

// -----------------------------
// JWT Authentication Middleware
// -----------------------------
function authenticateToken(req, res, next) {
  // Expecting header "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    // Attach user info to request
    req.user = decoded;
    next();
  });
}

// -----------------------------
// User Registration
// -----------------------------
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// User Login
// -----------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Destinations (Public GET)
// -----------------------------
app.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    return res.json(destinations);
  } catch (err) {
    console.error('Destinations error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Itinerary Endpoints (Protected)
// -----------------------------

// Create an itinerary
app.post('/itineraries', authenticateToken, async (req, res) => {
  const { name, destinations: destIds } = req.body;
  try {
    const itinerary = new Itinerary({
      name,
      user: req.user.id,
      destinations: destIds
    });
    await itinerary.save();
    return res.status(201).json(itinerary);
  } catch (err) {
    console.error('Create itinerary error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Get all itineraries for the logged-in user
app.get('/itineraries', authenticateToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id }).populate('destinations');
    return res.json(itineraries);
  } catch (err) {
    console.error('Get itineraries error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update an itinerary
app.put('/itineraries/:id', authenticateToken, async (req, res) => {
  const itineraryId = req.params.id;
  const { name, destinations: destIds } = req.body;
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: itineraryId, user: req.user.id },
      { name, destinations: destIds },
      { new: true }
    );
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    return res.json(itinerary);
  } catch (err) {
    console.error('Update itinerary error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete an itinerary
app.delete('/itineraries/:id', authenticateToken, async (req, res) => {
  const itineraryId = req.params.id;
  try {
    const result = await Itinerary.findOneAndDelete({ _id: itineraryId, user: req.user.id });
    if (!result) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    return res.json({ message: 'Itinerary deleted successfully.' });
  } catch (err) {
    console.error('Delete itinerary error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Start the Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// In app.js – add this new endpoint

app.post('/destinations/custom', authenticateToken, async (req, res) => {
  const { name, description, pictures, location } = req.body;
  // Basic validation (you may want to add more robust validation)
  if (!name || !description || !pictures || pictures.length !== 3 || !location || !location.coordinates) {
    return res.status(400).json({ error: 'Invalid input. Please provide name, description, 3 pictures, and location coordinates.' });
  }
  try {
    const newDestination = new Destination({ name, description, pictures, location });
    await newDestination.save();
    // Optionally, if using Socket.io, emit an event here
    res.status(201).json({ message: 'Custom destination submitted!', destination: newDestination });
  } catch (err) {
    console.error('Error submitting custom destination:', err);
    res.status(500).json({ error: err.message });
  }
});

// Public endpoint to retrieve an itinerary by ID without authentication
app.get('/public/itineraries/:id', async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('destinations');
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET profile: Returns user's email
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT profile: Allows user to update password (or other fields if needed)
app.put('/profile', authenticateToken, async (req, res) => {
  const updates = req.body;
  try {
    if (updates.password) {
       updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

