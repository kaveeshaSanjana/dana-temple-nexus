
import React from 'react';
import { MapPin, Star, Camera } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-blue-600">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
          Discover Beautiful
          <span className="block text-yellow-300">Sri Lanka</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto">
          Experience the pearl of the Indian Ocean with breathtaking landscapes, rich culture, and unforgettable adventures
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto bg-yellow-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-base sm:text-lg flex items-center justify-center gap-2">
            <MapPin size={20} />
            Explore Destinations
          </button>
          <button className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors text-base sm:text-lg flex items-center justify-center gap-2">
            <Camera size={20} />
            View Gallery
          </button>
        </div>
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-300" size={20} />
            <span className="text-sm sm:text-base">4.9/5 Rating</span>
          </div>
          <div className="text-sm sm:text-base">1000+ Happy Travelers</div>
          <div className="text-sm sm:text-base">50+ Destinations</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
