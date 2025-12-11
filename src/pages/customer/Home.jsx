import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import Navbar from "../../components/customer/navbar";

const offers = [
  {
    id: 1,
    title: "Meat Special",
    description: "20% off on all pasta dishes",
    code: "PASTA20",
    image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Pizza Night",
    description: "Buy 2 pizzas, get 1 free",
    code: "FAMILYMEAL",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Happy Hour",
    description: "50% off on all drinks from 4-6 PM",
    code: "HAPPYHOUR",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Steak Night",
    description: "Premium cuts with 15% off",
    code: "STEAKNIGHT",
    image: "https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen w-full text-white font-sans overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <div 
        className="h-screen w-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80&fit=crop&w=1920&q=80&fit=max)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to The Horeo</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">Experience authentic European cuisine with a modern twist</p>
          <Link 
            to="/menu" 
            className="bg-gradient-to-r from-[#06236B] to-[#0a3a9c] hover:opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
          >
            View Our Menu
          </Link>
        </div>
      </div>

      {/* Offers Carousel Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Today's Specials</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Discover our delicious offers and limited-time deals</p>
          
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="relative"
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id} className="pb-12">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-transform duration-300 hover:scale-105 border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        {offer.code}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    <button className="w-full bg-gradient-to-r from-[#06236B] to-[#0a3a9c] hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                      Order Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
