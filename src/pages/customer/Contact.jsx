import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import Navbar from "../../components/customer/navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />

      {/* Contact Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06236B] to-[#0a3a9c] mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3a9c] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3a9c] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a3a9c] focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#06236B] to-[#0a3a9c] hover:from-[#0a3a9c] hover:to-[#06236B] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#06236B] to-[#0a3a9c] mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-200 p-3 rounded-full text-gray-700 mr-4">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Our Location
                      </h3>
                      <p className="text-gray-600">
                        123 Food Street, Cuisine District
                      </p>
                      <p className="text-gray-600">New York, NY 10001, USA</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-200 p-3 rounded-full text-gray-700 mr-4">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phone Number
                      </h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">+1 (555) 765-4321</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-200 p-3 rounded-full text-gray-700 mr-4">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Email Address
                      </h3>
                      <p className="text-gray-600">info@Horeo.com</p>
                      <p className="text-gray-600">support@Horeo.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-200 p-3 rounded-full text-gray-700 mr-4">
                      <FaClock className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Opening Hours
                      </h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9:00 AM - 10:00 PM
                      </p>
                      <p className="text-gray-600">
                        Saturday - Sunday: 10:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition duration-300"
                    >
                      <FaFacebook className="text-xl" />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition duration-300"
                    >
                      <FaTwitter className="text-xl" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-full transition duration-300"
                    >
                      <FaInstagram className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                      to="/contact"
                      className="text-gray-300 hover:text-[#FF8A00] transition"
                    >
                      Contact
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
                &copy; {new Date().getFullYear()} Horeo. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
