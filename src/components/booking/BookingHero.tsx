import React from 'react';

const BookingHero = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Book Your Adventure</h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
          Select your activity, choose your time slot, and adjust duration as needed.
        </p>
      </div>
    </section>
  );
};

export default BookingHero;