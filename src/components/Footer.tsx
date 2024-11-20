import React from 'react';
import { PartyPopper, Stethoscope, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-black tracking-tighter text-white">rentalfinder.io</span>
            </div>
            <p className="text-sm">
              Connecting you with qualified equipment rental owners across all industries.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
              <li><Link to="/business" className="hover:text-blue-500">Leads Portal</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Equipment Categories</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Wrench className="h-4 w-4" />
                <span>Construction Equipment</span>
              </li>
              <li className="flex items-center space-x-2">
                <PartyPopper className="h-4 w-4" />
                <span>Party & Event Equipment</span>
              </li>
              <li className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span>Medical Equipment</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} rentalfinder.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}