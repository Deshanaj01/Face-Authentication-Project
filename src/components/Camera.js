import React, { useRef, useEffect } from 'react';

function Camera() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Assign the media stream directly to the video element's srcObject
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera: ', err);
      });
  }, []);

  return (
    <div className="flex justify-center mt-4">
      {/* Render the video element with a smaller size */}
      <video
        ref={videoRef}
        autoPlay
        className="w-64 h-48 rounded-md border border-gray-300"  // Adjust the size here
      />
    </div>
  );
}

export default Camera;
