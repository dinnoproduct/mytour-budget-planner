import { useEffect, useState } from 'react';

const MoveDragThreshold = 10;

const useDragDetection = () => {
  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let mouseMove = 0;

    const handleMouseUp = () => {
      setMouseDown(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseMove += Math.abs(e.movementX) + Math.abs(e.movementY);
      setDragging(mouseMove > MoveDragThreshold);
    };

    if (mouseDown) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseDown]);

  const handleMouseDown = () => {
    setMouseDown(true);
    setDragging(false);
  };

  return {
    handleMouseDown,
    dragging,
  };
};

export default useDragDetection;
