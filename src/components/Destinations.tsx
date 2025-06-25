
import React from 'react';
import { MapPin, Clock, Users } from 'lucide-react';

const Destinations = () => {
  const destinations = [
    {
      name: "Sigiriya Rock Fortress",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      duration: "Half Day",
      groupSize: "2-15 people",
      description: "Ancient rock fortress with stunning views and historical significance"
    },
    {
      name: "Kandy Temple",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop",
      duration: "Full Day",
      groupSize: "2-20 people", 
      description: "Sacred Buddhist temple in the cultural capital of Sri Lanka"
    },
    {
      name: "Ella Nine Arches",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
      duration: "Half Day",
      groupSize: "2-12 people",
      description: "Iconic railway bridge surrounded by lush tea plantations"
    }
  ];

  return (
    <section id="destinations" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the most beautiful and culturally rich destinations Sri Lanka has to offer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{destination.name}</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{destination.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={16} />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Users size={16} />
                    <span>{destination.groupSize}</span>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
                  <MapPin size={18} />
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
