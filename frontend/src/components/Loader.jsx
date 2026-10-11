import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <video
        src="/loader.mp4"
        autoPlay
        loop
        muted
        className="w-20 h-20 object-contain"
      />
    </div>
  );
};

export default Loader;
