import Loading from "@/components/Loading";
import React from "react";

export default function page() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading />
    </div>
  );
}
