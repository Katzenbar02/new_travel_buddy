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
  },
  {
  name: "Bogus Basin Mountain Recreation Area",
  description: "A favorite local getaway offering hiking, mountain biking, and winter sports.",
  pictures: [
    "https://via.placeholder.com/150?text=Bogus+Basin+1",
    "https://via.placeholder.com/150?text=Bogus+Basin+2",
    "https://via.placeholder.com/150?text=Bogus+Basin+3"
  ],
  coordinates: [-116.2500, 43.6500]
},
{
  name: "Lucky Peak State Park",
  description: "A popular day trip for water sports, picnics, and scenic views along the Boise River.",
  pictures: [
    "https://via.placeholder.com/150?text=Lucky+Peak+1",
    "https://via.placeholder.com/150?text=Lucky+Peak+2",
    "https://via.placeholder.com/150?text=Lucky+Peak+3"
  ],
  coordinates: [-116.4000, 43.5000]
},
{
  name: "Bruneau Dunes State Park",
  description: "Explore expansive sand dunes, hiking trails, and stargazing opportunities in a unique landscape.",
  pictures: [
    "https://via.placeholder.com/150?text=Bruneau+Dunes+1",
    "https://via.placeholder.com/150?text=Bruneau+Dunes+2",
    "https://via.placeholder.com/150?text=Bruneau+Dunes+3"
  ],
  coordinates: [-115.8500, 42.8500]
},
{
  name: "Shoshone Falls",
  description: "Often called the 'Niagara of the West,' these magnificent falls are a breathtaking sight.",
  pictures: [
    "https://via.placeholder.com/150?text=Shoshone+Falls+1",
    "https://via.placeholder.com/150?text=Shoshone+Falls+2",
    "https://via.placeholder.com/150?text=Shoshone+Falls+3"
  ],
  coordinates: [-114.5000, 42.6000]
},
{
  name: "Craters of the Moon National Monument",
  description: "Experience a surreal, lunar-like landscape created by ancient volcanic activity.",
  pictures: [
    "https://via.placeholder.com/150?text=Craters+of+the+Moon+1",
    "https://via.placeholder.com/150?text=Craters+of+the+Moon+2",
    "https://via.placeholder.com/150?text=Craters+of+the+Moon+3"
  ],
  coordinates: [-113.7500, 43.2000]
},
{
  name: "Morley Nelson Snake River Birds of Prey NCA",
  description: "Witness a diverse range of raptors in one of North America’s largest raptor conservation areas.",
  pictures: [
    "https://via.placeholder.com/150?text=Birds+of+Prey+1",
    "https://via.placeholder.com/150?text=Birds+of+Prey+2",
    "https://via.placeholder.com/150?text=Birds+of+Prey+3"
  ],
  coordinates: [-116.4000, 43.4000]
},
{
  name: "Boise River Greenbelt",
  description: "Enjoy a scenic trail along the Boise River, perfect for biking, walking, and soaking in nature.",
  pictures: [
    "https://via.placeholder.com/150?text=Greenbelt+1",
    "https://via.placeholder.com/150?text=Greenbelt+2",
    "https://via.placeholder.com/150?text=Greenbelt+3"
  ],
  coordinates: [-116.2222, 43.6150]
},
{
  name: "Table Rock",
  description: "A well-loved hike offering panoramic views of Boise and the surrounding foothills.",
  pictures: [
    "https://via.placeholder.com/150?text=Table+Rock+1",
    "https://via.placeholder.com/150?text=Table+Rock+2",
    "https://via.placeholder.com/150?text=Table+Rock+3"
  ],
  coordinates: [-116.2150, 43.6155]
},
{
  name: "Camel's Back Park",
  description: "A historic park in Boise featuring trails, picnic areas, and a peaceful atmosphere.",
  pictures: [
    "https://via.placeholder.com/150?text=Camel's+Back+1",
    "https://via.placeholder.com/150?text=Camel's+Back+2",
    "https://via.placeholder.com/150?text=Camel's+Back+3"
  ],
  coordinates: [-116.2250, 43.6300]
},
{
  name: "Julia Davis Park",
  description: "An urban oasis with museums, duck ponds, and ample space for relaxation in Boise.",
  pictures: [
    "https://via.placeholder.com/150?text=Julia+Davis+1",
    "https://via.placeholder.com/150?text=Julia+Davis+2",
    "https://via.placeholder.com/150?text=Julia+Davis+3"
  ],
  coordinates: [-116.2020, 43.6100]
},
{
  name: "Kathryn Albertson Park",
  description: "A beautifully landscaped park known for its walking trails, ponds, and wildlife viewing.",
  pictures: [
    "https://via.placeholder.com/150?text=Albertson+Park+1",
    "https://via.placeholder.com/150?text=Albertson+Park+2",
    "https://via.placeholder.com/150?text=Albertson+Park+3"
  ],
  coordinates: [-116.2200, 43.6000]
},
{
  name: "World Center for Birds of Prey",
  description: "An educational center where visitors can learn about and view a variety of majestic birds of prey.",
  pictures: [
    "https://via.placeholder.com/150?text=Birds+Center+1",
    "https://via.placeholder.com/150?text=Birds+Center+2",
    "https://via.placeholder.com/150?text=Birds+Center+3"
  ],
  coordinates: [-116.2100, 43.6300]
},
{
  name: "Boise Foothills Scenic Byway",
  description: "A scenic drive offering breathtaking views of the foothills and access to numerous hiking trails.",
  pictures: [
    "https://via.placeholder.com/150?text=Foothills+Byway+1",
    "https://via.placeholder.com/150?text=Foothills+Byway+2",
    "https://via.placeholder.com/150?text=Foothills+Byway+3"
  ],
  coordinates: [-116.2500, 43.6400]
},
{
  name: "Eagle Island State Park",
  description: "A riverside park near Eagle offering water recreation, picnicking, and scenic nature trails.",
  pictures: [
    "https://via.placeholder.com/150?text=Eagle+Island+1",
    "https://via.placeholder.com/150?text=Eagle+Island+2",
    "https://via.placeholder.com/150?text=Eagle+Island+3"
  ],
  coordinates: [-116.4000, 43.6200]
},
{
  name: "Simplot Canyon",
  description: "A rugged canyon ideal for hiking and exploring unique rock formations with stunning vistas.",
  pictures: [
    "https://via.placeholder.com/150?text=Simplot+Canyon+1",
    "https://via.placeholder.com/150?text=Simplot+Canyon+2",
    "https://via.placeholder.com/150?text=Simplot+Canyon+3"
  ],
  coordinates: [-116.3000, 43.5500]
},
{
  name: "Idaho Botanical Garden",
  description: "A peaceful retreat showcasing native plants and seasonal exhibits in a beautifully maintained setting.",
  pictures: [
    "https://via.placeholder.com/150?text=Botanical+Garden+1",
    "https://via.placeholder.com/150?text=Botanical+Garden+2",
    "https://via.placeholder.com/150?text=Botanical+Garden+3"
  ],
  coordinates: [-116.2400, 43.6100]
},
{
  name: "Roaring Springs Nature Preserve",
  description: "A hidden gem featuring tranquil springs, well-marked trails, and abundant wildlife.",
  pictures: [
    "https://via.placeholder.com/150?text=Roaring+Springs+1",
    "https://via.placeholder.com/150?text=Roaring+Springs+2",
    "https://via.placeholder.com/150?text=Roaring+Springs+3"
  ],
  coordinates: [-116.3500, 43.6000]
},
{
  name: "Snake River Overlook",
  description: "Enjoy dramatic views of the winding Snake River from this picturesque overlook.",
  pictures: [
    "https://via.placeholder.com/150?text=Snake+River+1",
    "https://via.placeholder.com/150?text=Snake+River+2",
    "https://via.placeholder.com/150?text=Snake+River+3"
  ],
  coordinates: [-116.3500, 43.5800]
},
{
  name: "Indian Creek Preserve",
  description: "A serene nature preserve perfect for quiet hikes and birdwatching in a lush environment.",
  pictures: [
    "https://via.placeholder.com/150?text=Indian+Creek+1",
    "https://via.placeholder.com/150?text=Indian+Creek+2",
    "https://via.placeholder.com/150?text=Indian+Creek+3"
  ],
  coordinates: [-116.3000, 43.6200]
},
{
  name: "Sawtooth Scenic Byway",
  description: "A breathtaking drive that showcases the rugged beauty of Idaho’s Sawtooth Mountains and surrounding landscapes.",
  pictures: [
    "https://via.placeholder.com/150?text=Sawtooth+Byway+1",
    "https://via.placeholder.com/150?text=Sawtooth+Byway+2",
    "https://via.placeholder.com/150?text=Sawtooth+Byway+3"
  ],
  coordinates: [-115.8000, 44.0000]
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
