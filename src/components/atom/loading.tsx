import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border-4 border-neutral-200 border-t-neutral-700 animate-spin" />
    </div>
  );
};

export default Loading; 