import React from "react";
import Link from "next/link";

const ModernBanner = () => {
  return (
    <div className="bg-background pt-0 pb-12">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div 
            className="group relative flex flex-col justify-between w-full rounded-2xl bg-gradient-to-b from-[#dcfce7] to-white dark:from-emerald-950/20 dark:to-background overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 lg:p-6 border border-border/30 min-h-[260px] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center z-10 w-full mb-4">
              <h3 className="text-base lg:text-md font-bold text-gray-800 dark:text-gray-100 leading-tight mb-2 uppercase tracking-wide">
               ENJOY 10% OFF YOUR FIRST ORDER
              </h3>
              
              <img 
                src="https://i.ibb.co.com/dsqXkPxK/Gemini-Generated-Image-s5sx55s5sx55s5sx-2.png"
                alt="Grocery Banner"
                className="w-full h-auto max-h-32 transition-transform duration-500 rounded-lg group-hover:scale-105 my-2 object-contain"
              />
            </div>
            
            <div className="flex items-end justify-between w-full z-10">
              <p className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm max-w-[70%]">
                Sign up today and get instant savings on your first grocery purchase.
              </p>
              <Link href="/register" className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors shrink-0 flex-none shadow-lg cursor-pointer pointer-events-auto" style={{ backgroundColor: '#111827' }}>
                <svg className="w-4 h-4 text-white ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="group relative flex flex-col justify-between w-full rounded-2xl bg-gradient-to-b from-[#ffe4e6] to-white dark:from-rose-950/20 dark:to-background overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 lg:p-6 border border-border/30 min-h-[260px] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center z-10 w-full mb-4">
              <h3 className="text-base lg:text-md font-bold text-gray-800 dark:text-gray-100 leading-tight mb-2 uppercase tracking-wide">
                FREE DELIVERY ON ORDERS OVER $50
              </h3>
              
              <img 
                src="https://i.ibb.co.com/dsqXkPxK/Gemini-Generated-Image-s5sx55s5sx55s5sx-2.png"
                alt="Grocery Banner"
                className="w-full h-auto max-h-32 transition-transform duration-500 rounded-lg group-hover:scale-105 my-2 object-contain"
              />
            </div>
            
            <div className="flex items-end justify-between w-full z-10">
              <p className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm max-w-[70%]">
                Stock up on your weekly groceries and save more with zero delivery charges.
              </p>
              <Link href="/register" className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors shrink-0 flex-none shadow-lg cursor-pointer pointer-events-auto" style={{ backgroundColor: '#111827' }}>
                <svg className="w-4 h-4 text-white ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="group relative flex flex-col justify-between w-full rounded-2xl bg-gradient-to-b from-[#fef9c3] to-white dark:from-yellow-900/20 dark:to-background overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 p-5 lg:p-6 border border-border/30 min-h-[260px] cursor-pointer"
          >
            <div className="flex flex-col items-center text-center z-10 w-full mb-4">
              <h3 className="text-base lg:text-md font-bold text-gray-800 dark:text-gray-100 leading-tight mb-2 uppercase tracking-wide">
                FRESH GROCERIES FOR YOUR FAMILY.
              </h3>
              
              <img 
                src="https://i.ibb.co.com/dsqXkPxK/Gemini-Generated-Image-s5sx55s5sx55s5sx-2.png"
                alt="Grocery Banner"
                className="w-full h-auto max-h-32 transition-transform duration-500 rounded-lg group-hover:scale-105 my-2 object-contain"
              />
            </div>
            
            <div className="flex items-end justify-between w-full z-10">
              <p className="text-gray-600 dark:text-gray-300 font-medium text-xs sm:text-sm max-w-[70%]">
                We deliver everything you need straight to your door.
              </p>
              <Link href="/register" className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center transition-colors shrink-0 flex-none shadow-lg cursor-pointer pointer-events-auto" style={{ backgroundColor: '#111827' }}>
                <svg className="w-4 h-4 text-white ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ModernBanner;
