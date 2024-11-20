import React, { useState } from 'react';
import LeadForm from '../components/LeadForm';
import { CheckCircle2, DollarSign, Shield, Timer, Construction, PartyPopper, Stethoscope } from 'lucide-react';

export default function HomePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLeadSubmit = () => {
    setShowSuccess(true);
  };

  const handleNewRequest = () => {
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Form */}
      <div 
        className="relative py-16 lg:py-24 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(15, 23, 42, 0.9),
              rgba(29, 78, 216, 0.85)
            ),
            url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80')
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
              Whatever you need for a moment.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Skip the endless scrolling. Let top-rated rental providers find you.
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            {showSuccess ? (
              <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Request Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-8">
                  Rental providers will be notified and will contact you shortly.
                </p>
                <button
                  onClick={handleNewRequest}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit New Request
                </button>
              </div>
            ) : (
              <LeadForm onSubmitSuccess={handleLeadSubmit} />
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose rentalfinder.io?
            </h2>
            <p className="text-xl text-gray-600">
              We make equipment rental simple, secure, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: "Verified Providers",
                description: "All equipment providers are thoroughly vetted",
                icon: Shield
              },
              {
                title: "Quick Response",
                description: "Get quotes within hours",
                icon: Timer
              },
              {
                title: "Best Rates",
                description: "Compare prices from multiple providers",
                icon: DollarSign
              },
              {
                title: "Quality Assured",
                description: "All equipment meets industry standards",
                icon: CheckCircle2
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Equipment Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find the right equipment for any need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <Construction className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Construction Equipment</h3>
              <p className="text-gray-600">From heavy machinery to power tools</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <PartyPopper className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Party & Event Equipment</h3>
              <p className="text-gray-600">Everything for your special occasion</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center">
              <Stethoscope className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Medical Equipment</h3>
              <p className="text-gray-600">Professional healthcare equipment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}