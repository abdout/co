import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="container px-8 py-28  min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
        </div>
      </div>
  );
};

export default Loading; 