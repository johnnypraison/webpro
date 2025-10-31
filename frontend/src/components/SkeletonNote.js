import React from 'react';

const SkeletonNote = () => {
  const alignment = Math.random() > 0.5 ? 'align-self-start' : 'align-self-end';
  return (
    <div className={`skeleton-note my-2 w-75 ${alignment}`}>
      <div className="d-flex justify-content-between">
        <div className="skeleton-line" style={{ width: '30%', height: '1.2rem' }}></div>
        <div className="skeleton-line" style={{ width: '10%', height: '0.8rem' }}></div>
      </div>
      <div className="skeleton-line mt-3" style={{ width: '90%' }}></div>
      <div className="skeleton-line mt-2" style={{ width: '70%' }}></div>
      <div className="skeleton-line mt-3 ms-auto" style={{ width: '40%', height: '0.8rem' }}></div>
    </div>
  );
};

export default SkeletonNote;