
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">SriLanka Guide</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Your trusted partner for exploring the beautiful island of Sri Lanka. 
              We create unforgettable experiences and memories.
            </p>
            <div className="flex space-x-4">
              <button className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Facebook size={20} />
              </button>
              <button className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Instagram size={20} />
              </button>
              <button className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Twitter size={20} />
              </button>
              <button className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Youtube size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm sm:text-base">Home</a></li>
              <li><a href="#destinations" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm sm:text-base">Destinations</a></li>
              <li><a href="#experiences" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm sm:text-base">Experiences</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm sm:text-base">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm sm:text-base">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300 text-sm sm:text-base">Guided Tours</span></li>
              <li><span className="text-gray-300 text-sm sm:text-base">Hotel Booking</span></li>
              <li><span className="text-gray-300 text-sm sm:text-base">Transportation</span></li>
              <li><span className="text-gray-300 text-sm sm:text-base">Photography</span></li>
              <li><span className="text-gray-300 text-sm sm:text-base">Custom Packages</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg sm:text-xl font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">123 Galle Road, Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">+94 77 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm sm:text-base">info@srilankaguide.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center sm:text-left">
              © 2024 SriLanka Guide. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
              <button className="text-gray-300 hover:text-emerald-400 transition-colors">Privacy Policy</button>
              <button className="text-gray-300 hover:text-emerald-400 transition-colors">Terms of Service</button>
              <button className="text-gray-300 hover:text-emerald-400 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
