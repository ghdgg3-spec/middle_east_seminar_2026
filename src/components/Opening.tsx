import React from 'react';

const Opening = ({ onSkip }: { onSkip: () => void }) => {
  return (
    <div className="video-opening">
      <video className="video-bg" autoPlay muted playsInline onEnded={onSkip}>
        <source src="assets/opening.mp4" type="video/mp4" />
      </video>
      <button className="skip-btn" onClick={onSkip}>Skip</button>
    </div>
  );
};

export default Opening;
