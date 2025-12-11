import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHeart, FaAward, FaLeaf, FaUsers, FaStar, FaLeaf as FaLeafIcon, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { GiMeal, GiCook } from 'react-icons/gi';
import { MdOutlineDeliveryDining } from 'react-icons/md';
import Navbar from '../../components/customer/navbar';

const AboutPage = () => {
  const stats = [
    { icon: <GiMeal className="text-4xl text-amber-600" />, value: '500+', label: 'Menu Items' },
    { icon: <FaUsers className="text-4xl text-amber-600" />, value: '10K+', label: 'Happy Customers' },
    { icon: <MdOutlineDeliveryDining className="text-4xl text-amber-600" />, value: '25K+', label: 'Deliveries' },
    { icon: <FaStar className="text-4xl text-amber-600" />, value: '4.8/5', label: 'Customer Rating' },
  ];

  const features = [
    {
      icon: <FaLeafIcon className="text-2xl text-green-600" />,
      title: 'Fresh Ingredients',
      description: 'We source only the freshest, locally-sourced ingredients for our dishes.'
    },
    {
      icon: <GiCook className="text-2xl text-amber-600" />,
      title: 'Expert Chefs',
      description: 'Our culinary team brings years of experience and passion to every dish.'
    },
    {
      icon: <FaUtensils className="text-2xl text-red-500" />,
      title: 'Diverse Menu',
      description: 'Explore a wide variety of cuisines to satisfy every palate.'
    },
    {
      icon: <FaAward className="text-2xl text-blue-500" />,
      title: 'Award Winning',
      description: 'Recognized for excellence in food quality and customer service.'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Bringing people together through the love of food since 2010. Our passion for authentic flavors and warm hospitality makes every meal special.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-lg hover:bg-blue-50 transition-all duration-300">
                <div className="mb-3">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To create memorable dining experiences by serving delicious, high-quality food made with the finest ingredients, while providing exceptional service in a warm and welcoming atmosphere.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 mb-6">
                We envision becoming the most loved restaurant brand, known for our commitment to quality, innovation, and sustainability in the food industry.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Commitment to sustainability</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Community engagement</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Culinary excellence</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
              <div className="space-y-4 flex-grow">
                <div>
                  <h4 className="font-semibold text-lg text-[#06236B]">Quality</h4>
                  <p className="text-gray-600 mt-1">We never compromise on the quality of our ingredients or preparation.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-[#0a3a9c] mt-4">Passion</h4>
                  <p className="text-gray-600 mt-1">Cooking is our passion, and we put our heart into every dish.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-[#06236B] mt-4">Community</h4>
                  <p className="text-gray-600 mt-1">We believe in giving back and supporting our local community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our Customers Say</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-[#0a3a9c] text-4xl mb-4">"</div>
              <p className="text-xl text-gray-700 italic mb-6">
                The food here is absolutely amazing! Every dish is prepared with so much care and love. The flavors are incredible and the service is top-notch. Highly recommended!
              </p>
              <div className="font-semibold text-gray-800">Sarah Johnson</div>
              <div className="text-[#0a3a9c] font-medium">Regular Customer</div>
            </div>
          </div>
        </div>
      </div>

     

      {/* Footer */}
      <footer className="bg-[#061A3B] text-white relative">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto relative">
            <div className="absolute bottom-4 right-4 w-80 h-56 rounded-lg overflow-hidden shadow-lg border-2 border-white z-10">
              <iframe
                title="Our Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=123%20Food%20Street%2C%20New%20York+(TheEuro%20Plate)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                className="border-0"
                style={{ filter: "grayscale(20%)" }}
              ></iframe>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/home"
                      className="text-gray-300 hover:text-[#FF8A00] transition"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu"
                      className="text-gray-300 hover:text-[#FF8A00] transition"
                    >
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-[#FF8A00] transition"
                    >
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-2 text-white" />
                    <span>123 Food Street, New York</span>
                  </li>
                  <li className="flex items-center">
                    <FaPhone className="mr-2 text-white" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center">
                    <FaEnvelope className="mr-2 text-white" />
                    <span>info@horeo.com</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 text-center text-gray-400 w-full">
              <p className="mx-auto">
                &copy; {new Date().getFullYear()} Horeo Plate. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple checkmark icon component
const FaCheckCircle = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
  </svg>
);

export default AboutPage;