import React, { useState } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { toast } from "react-toastify";

const FullScreenToggle = ({ pageRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      pageRef.current?.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };
  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? (
        <MdFullscreenExit className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
      ) : (
        <MdFullscreen className="text-2xl hover:fill-accentDark transition-all duration-300 ease-in" />
      )}
    </button>
  );
};

export default FullScreenToggle;
