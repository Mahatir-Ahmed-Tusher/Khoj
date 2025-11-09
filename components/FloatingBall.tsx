import Link from "next/link";
import React from "react";

export default function FloatingBall() {
  return (
    <Link
      href={"/news-collection"}
      className="fixed bottom-24 left-4 right-auto sm:bottom-[26%] sm:right-10 sm:left-auto p-4 rounded-md border shadow-black shadow-sm bg-yellow-300 text-white animate-none sm:animate-bounce-custom"
    >
      <span className="sm:inline hidden">সাম্প্রতিক খবর সমূহ</span>
      <span className="text-sm sm:hidden">খবর</span>
    </Link>
  );
}
