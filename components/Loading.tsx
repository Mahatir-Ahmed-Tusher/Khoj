import React from "react";

export default function Loading() {
  return (
    <div className="text-center py-8 sm:py-12">
      <p className="text-lg text-gray-600 mb-6 font-tiro-bangla">
        রিপোর্ট তৈরি করা হচ্ছে...
      </p>
      <img
        src="/Loading Screens/factchecking-loading-screen-highQ.gif"
        alt="Loading animation"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mx-auto"
      />
    </div>
  );
}
