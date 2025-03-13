import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Animation des points */}
      <div className="flex space-x-2 mb-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
      
      {/* Texte animé */}
      <p className="text-lg font-semibold text-blue-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
