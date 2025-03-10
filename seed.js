// seed.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/travelbuddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Define the Destination schema (must match app.js)
const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pictures: { 
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length === 3;
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

// 10 Awesome Places near Rexburg (approximate coordinates)
const destinations = [
  {
    name: 'Mesa Falls',
    description: 'Spectacular waterfalls near Ashton, ID.',
    pictures: [
      'https://via.placeholder.com/150?text=Mesa+Falls+1',
      'https://via.placeholder.com/150?text=Mesa+Falls+2',
      'https://via.placeholder.com/150?text=Mesa+Falls+3'
    ],
    location: { coordinates: [-111.3247, 44.0722] }
  },
  {
    name: 'Grand Targhee Resort',
    description: 'Skiing, hiking, and stunning views of the Tetons.',
    pictures: [
      'https://via.placeholder.com/150?text=Grand+Targhee+1',
      'https://via.placeholder.com/150?text=Grand+Targhee+2',
      'https://via.placeholder.com/150?text=Grand+Targhee+3'
    ],
    location: { coordinates: [-110.93, 43.79] }
  },
  {
    name: 'Yellowstone (West Entrance)',
    description: 'Iconic national park with geysers and wildlife.',
    pictures: [
      'https://via.placeholder.com/150?text=Yellowstone+1',
      'https://via.placeholder.com/150?text=Yellowstone+2',
      'https://via.placeholder.com/150?text=Yellowstone+3'
    ],
    location: { coordinates: [-111.1113, 44.6621] }
  },
  {
    name: 'Jackson Hole, WY',
    description: 'Famous valley near the Tetons with outdoor fun.',
    pictures: [
      'https://via.placeholder.com/150?text=Jackson+Hole+1',
      'https://via.placeholder.com/150?text=Jackson+Hole+2',
      'https://via.placeholder.com/150?text=Jackson+Hole+3'
    ],
    location: { coordinates: [-110.7624, 43.4799] }
  },
  {
    name: 'Craters of the Moon',
    description: 'Otherworldly volcanic landscapes in central Idaho.',
    pictures: [
      'https://via.placeholder.com/150?text=Craters+of+the+Moon+1',
      'https://via.placeholder.com/150?text=Craters+of+the+Moon+2',
      'https://via.placeholder.com/150?text=Craters+of+the+Moon+3'
    ],
    location: { coordinates: [-113.5167, 43.4167] }
  },
  {
    name: 'Idaho Falls',
    description: 'City on the Snake River with a scenic greenbelt.',
    pictures: [
      'https://via.placeholder.com/150?text=Idaho+Falls+1',
      'https://via.placeholder.com/150?text=Idaho+Falls+2',
      'https://via.placeholder.com/150?text=Idaho+Falls+3'
    ],
    location: { coordinates: [-112.0341, 43.4917] }
  },
  {
    name: 'Island Park',
    description: 'Outdoor recreation hotspot with fishing and hiking.',
    pictures: [
      'https://via.placeholder.com/150?text=Island+Park+1',
      'https://via.placeholder.com/150?text=Island+Park+2',
      'https://via.placeholder.com/150?text=Island+Park+3'
    ],
    location: { coordinates: [-111.3387, 44.3955] }
  },
  {
    name: 'Bear World',
    description: 'Drive-thru wildlife park with bears and more.',
    pictures: [
      'https://via.placeholder.com/150?text=Bear+World+1',
      'https://via.placeholder.com/150?text=Bear+World+2',
      'https://via.placeholder.com/150?text=Bear+World+3'
    ],
    location: { coordinates: [-111.7395, 43.6108] }
  },
  {
    name: 'Palisades Reservoir',
    description: 'Beautiful reservoir in the Caribou-Targhee forest.',
    pictures: [
      'https://via.placeholder.com/150?text=Palisades+Reservoir+1',
      'https://via.placeholder.com/150?text=Palisades+Reservoir+2',
      'https://via.placeholder.com/150?text=Palisades+Reservoir+3'
    ],
    location: { coordinates: [-111.2196, 43.3827] }
  },
  {
    name: 'Big Springs',
    description: 'Crystal-clear spring and iconic Johnny Sack Cabin.',
    pictures: [
      'https://via.placeholder.com/150?text=Big+Springs+1',
      'https://via.placeholder.com/150?text=Big+Springs+2',
      'https://via.placeholder.com/150?text=Big+Springs+3'
    ],
    location: { coordinates: [-111.2997, 44.4983] }
  }
];

async function seedDB() {
  try {
    await Destination.deleteMany({});
    console.log('Cleared previous destinations');
    await Destination.insertMany(destinations);
    console.log('Inserted 10 awesome places');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
