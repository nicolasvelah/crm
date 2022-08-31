import React, { FunctionComponent } from 'react';

const Modal: FunctionComponent<{
  display: boolean;
  onClose: (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ display = true, onClose }) => {
  return (
    <div className={`w-screen h-screen fixed top-0 right-0 bg-gray-500 bg-opacity-75 z-30 ${display ? 'block' : 'hidden'} transition-all duration-100 ease-in-out`}>
      <div className="w-64 h-56 bg-white flex">
        <div onClick={onClose}>Close</div>
        Soy el Modal
      </div>
    </div>
  );
};

export default Modal;
