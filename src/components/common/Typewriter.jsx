import React, { useState, useEffect } from 'react';

const Typewriter = ({ 
  data, 
  typeSpeed = 50, 
  deleteSpeed = 30, 
  pauseEnd = 2000,   
  pauseStart = 500   
}) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const totalChars = data.reduce((acc, curr) => acc + curr.text.length, 0);

  useEffect(() => {
    let timer;
    if (!isDeleting && displayedChars < totalChars) {
      timer = setTimeout(() => setDisplayedChars((prev) => prev + 1), typeSpeed);
    } else if (!isDeleting && displayedChars === totalChars) {
      timer = setTimeout(() => setIsDeleting(true), pauseEnd);
    } else if (isDeleting && displayedChars > 0) {
      timer = setTimeout(() => setDisplayedChars((prev) => prev - 1), deleteSpeed);
    } else if (isDeleting && displayedChars === 0) {
      timer = setTimeout(() => setIsDeleting(false), pauseStart);
    }
    return () => clearTimeout(timer);
  }, [displayedChars, isDeleting, totalChars, typeSpeed, deleteSpeed, pauseEnd, pauseStart]);

  const renderText = () => {
    let charCount = 0;
    return data.map((segment, index) => {
      const charsToShow = Math.max(0, displayedChars - charCount);
      const textSegment = segment.text.substring(0, charsToShow);
      charCount += segment.text.length;
      if (charsToShow <= 0) return null;
      return <span key={index} className={segment.className}>{textSegment}</span>;
    });
  };

  return (
    <span className="inline-block min-h-[1.5em]">
      {renderText()}
      <span className="animate-pulse font-light text-orange-400">|</span>
    </span>
  );
};
export default Typewriter;