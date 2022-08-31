import React from 'react';

const AspectRatio = ({
  children,
  ratio,
}: {
  ratio: number;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: `${ratio * 100}%`,
        width: '100%',
      }}
    >
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
};

export default AspectRatio;
