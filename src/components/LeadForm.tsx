import React, { useState, useRef, useEffect } from 'react';
import { Calendar, DollarSign, MapPin, Construction, PartyPopper, Stethoscope, X } from 'lucide-react';
import { useLeads } from '../store/LeadContext';

interface LeadFormProps {
  onSubmitSuccess?: () => void;
}

export default function LeadForm({ onSubmitSuccess }: LeadFormProps) {
  const { addLead } = useLeads();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    equipmentTypes: [] as string[],
    rentalDuration: '',
    startDate: '',
    budget: '',
    street: '',
    city: '',
    zipCode: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const equipmentCategories = {
    construction: [
      'Excavator',
      'Bulldozer',
      'Crane',
      'Forklift',
      'Generator',
      'Backhoe',
      'Skid Steer',
      'Dump Truck',
      'Concrete Mixer',
      'Air Compressor',
      'Scissor Lift',
      'Boom Lift',
      'Trencher',
      'Portable Light Tower',
      'Compactor',
      'Other Construction'
    ],
    party: [
      // Tents & Structures
      'Large Event Tent',
      'Pop-up Canopy',
      'Wedding Tent',
      'Pole Tent',
      'Frame Tent',
      'Clear Span Tent',
      'Gazebo',
      
      // Furniture
      'Banquet Tables',
      'Round Tables',
      'Cocktail Tables',
      'Chiavari Chairs',
      'Folding Chairs',
      'Lounge Furniture',
      'Bar Stools',
      'Kids Tables & Chairs',
      
      // Audio & Visual
      'PA System',
      'Speakers',
      'Wireless Microphones',
      'DJ Equipment',
      'Projector & Screen',
      'LED TV Displays',
      'Karaoke System',
      
      // Lighting
      'String Lights',
      'LED Uplighting',
      'Disco Ball',
      'Spotlights',
      'LED Dance Floor Lights',
      'Laser Lights',
      'Par Can Lights',
      
      // Dance & Stage
      'Portable Dance Floor',
      'Stage Platforms',
      'Podium',
      'Runway',
      'Portable Risers',
      
      // Bar & Beverage
      'Portable Bar',
      'Beverage Dispensers',
      'Ice Bins',
      'Champagne Fountain',
      'Margarita Machine',
      'Kegerator',
      'Wine Coolers',
      
      // Food Service
      'Chafing Dishes',
      'Coffee Makers',
      'Hot Dog Roller',
      'Popcorn Machine',
      'Cotton Candy Machine',
      'Snow Cone Machine',
      'Chocolate Fountain',
      
      // Linens & Decor
      'Table Linens',
      'Chair Covers',
      'Table Runners',
      'Napkins',
      'Backdrop & Draping',
      'Pipe & Drape',
      'Centerpieces',
      
      // Games & Entertainment
      'Photo Booth',
      'Arcade Games',
      'Casino Tables',
      'Giant Yard Games',
      'Bounce House',
      'Inflatable Slides',
      'Dunk Tank',
      
      // Outdoor & Comfort
      'Patio Heaters',
      'Misting Fans',
      'Portable AC Units',
      'Outdoor Fans',
      'Market Umbrellas',
      
      // Practical Necessities
      'Portable Restrooms',
      'Luxury Restroom Trailer',
      'Hand Washing Stations',
      'Portable Generator',
      'Power Distribution',
      'Extension Cords',
      
      // Special Effects
      'Fog Machine',
      'Bubble Machine',
      'Confetti Cannon',
      'CO2 Jets',
      'Pyrotechnics Equipment',
      
      // Seasonal & Theme
      'Holiday Decorations',
      'Theme Props',
      'Costume Characters',
      'Halloween Props',
      'Christmas Decor',
      
      'Other Party'
    ],
    medical: [
      'Hospital Beds',
      'Mobility Equipment',
      'Patient Lifts',
      'Oxygen Equipment',
      'Monitoring Devices',
      'Wheelchair',
      'Walker',
      'CPAP Machine',
      'Nebulizer',
      'IV Stands',
      'Blood Pressure Monitor',
      'Portable Oxygen Concentrator',
      'Hospital Chair',
      'Commode',
      'Bath Safety Equipment',
      'Other Medical'
    ]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addLead(formData);
      setFormData({
        category: '',
        equipmentTypes: [],
        rentalDuration: '',
        startDate: '',
        budget: '',
        street: '',
        city: '',
        zipCode: '',
        name: '',
        email: '',
        phone: '',
        details: ''
      });
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'category') {
      setFormData(prev => ({ ...prev, equipmentTypes: [] }));
      setInputValue('');
      setSuggestions(equipmentCategories[value as keyof typeof equipmentCategories] || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);

    if (formData.category) {
      const categoryEquipment = equipmentCategories[formData.category as keyof typeof equipmentCategories];
      const filtered = categoryEquipment.filter(type => 
        !formData.equipmentTypes.includes(type) &&
        type.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleInputFocus = () => {
    if (formData.category && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const addEquipmentType = (type: string) => {
    if (!formData.equipmentTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        equipmentTypes: [...prev.equipmentTypes, type]
      }));
      setInputValue('');
      setSuggestions(prev => prev.filter(t => t !== type));
      setShowSuggestions(false);
    }
  };

  const removeEquipmentType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentTypes: prev.equipmentTypes.filter(t => t !== type)
    }));
    if (formData.category) {
      setSuggestions(prev => [...prev, type].sort());
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction':
        return <Construction className="h-5 w-5 text-blue-600" />;
      case 'party':
        return <PartyPopper className="h-5 w-5 text-blue-600" />;
      case 'medical':
        return <Stethoscope className="h-5 w-5 text-blue-600" />;
      default:
        return <Construction className="h-5 w-5 text-blue-600" />;
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const inputClasses = "w-full h-[42px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
            {getCategoryIcon(formData.category)}
            <span>What's the occasion?</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select category</option>
            <option value="construction">Construction</option>
            <option value="party">Party/Event</option>
            <option value="medical">Medical</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative" ref={dropdownRef}>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              {getCategoryIcon(formData.category)}
              <span>Equipment Types</span>
            </label>
            <div className="relative">
              <div className="min-h-[42px] border border-gray-300 rounded-md px-3 py-1 flex flex-wrap items-center gap-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
                {formData.equipmentTypes.map((type) => (
                  <span 
                    key={type}
                    className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeEquipmentType(type)}
                      className="ml-2 focus:outline-none"
                    >
                      <X className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder={formData.category ? "Type to search equipment..." : "Select a category first"}
                  className="flex-1 h-[30px] min-w-[120px] focus:outline-none bg-transparent text-gray-900"
                  disabled={!formData.category}
                />
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addEquipmentType(type)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>When do you need it?</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={minDate}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Rental Duration</span>
            </label>
            <select
              name="rentalDuration"
              value={formData.rentalDuration}
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="">Select duration</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="longterm">Long-term</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Budget Range</span>
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="">Select budget range</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="10000+">$10,000+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Street Address</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>City</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Zip Code</span>
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Additional Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md transition duration-150 ease-in-out ${
            submitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}