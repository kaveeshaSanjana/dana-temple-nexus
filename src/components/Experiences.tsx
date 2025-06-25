
import React from 'react';
import { Mountain, Waves, Camera, Coffee } from 'lucide-react';

const Experiences = () => {
  const experiences = [
    {
      icon: Mountain,
      title: "Mountain Hiking",
      description: "Explore scenic mountain trails and witness breathtaking sunrises",
      price: "From $50"
    },
    {
      icon: Waves,
      title: "Beach Activities", 
      description: "Enjoy surfing, snorkeling, and relaxing on pristine beaches",
      price: "From $30"
    },
    {
      icon: Camera,
      title: "Photography Tours",
      description: "Capture stunning landscapes with professional guidance",
      price: "From $75"
    },
    {
      icon: Coffee,
      title: "Tea Plantation Visits",
      description: "Learn about Ceylon tea production in beautiful hill country",
      price: "From $40"
    }
  ];

  return (
    <section id="experiences" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unique Experiences
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Create unforgettable memories with our curated experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {experiences.map((experience, index) => {
            const IconComponent = experience.icon;
            return (
              <div key={index} className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 hover:shadow-lg transition-shadow">
                <div className="bg-emerald-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <IconComponent className="text-white" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{experience.title}</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{experience.description}</p>
                <div className="text-emerald-600 font-bold text-lg sm:text-xl mb-4 sm:mb-6">{experience.price}</div>
                <button className="w-full bg-emerald-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm sm:text-base">
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
