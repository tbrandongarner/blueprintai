import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';

function BlueprintCanvas({ data, onShapesChange }) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragItemId, setDragItemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState(data.shapes || []);
  const shapesRef = useRef(shapes);
  const pendingAnimation = useRef(false);

  // Keep ref synced with state
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  // Sync local shapes with incoming data
  useEffect(() => {
    setShapes(data.shapes || []);
  }, [data.shapes]);

  const getCursorPosition = e => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ratio = canvas.width / rect.width;
    return {
      x: (e.clientX - rect.left) * ratio,
      y: (e.clientY - rect.top) * ratio
    };
  };

  const renderCanvas = (ctx, shapesArr = shapesRef.current) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (data.grid && data.grid.show) {
      const gap = data.grid.size || 50;
      ctx.strokeStyle = data.grid.color || '#eee';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    shapesArr.forEach(shape => {
      ctx.fillStyle = shape.color || '#000';
      ctx.strokeStyle = shape.strokeColor || '#000';
      ctx.lineWidth = shape.strokeWidth || 1;
      if (shape.type === 'rect') {
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        if (shape.strokeWidth) {
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.fill();
        if (shape.strokeWidth) ctx.stroke();
      }
    });
  };

  const findShapeAt = (x, y) => {
    const arr = shapesRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const s = arr[i];
      if (s.type === 'rect') {
        if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) return s;
      } else if (s.type === 'circle') {
        const dx = x - s.x;
        const dy = y - s.y;
        if (dx * dx + dy * dy <= s.radius * s.radius) return s;
      }
    }
    return null;
  };

  const scheduleRender = (updatedShapes) => {
    if (pendingAnimation.current) return;
    pendingAnimation.current = true;
    requestAnimationFrame(() => {
      const ctx = canvasRef.current.getContext('2d');
      renderCanvas(ctx, updatedShapes);
      pendingAnimation.current = false;
    });
  };

  const handleMouseDown = e => {
    const pos = getCursorPosition(e);
    const shape = findShapeAt(pos.x, pos.y);
    if (!shape) return;
    setIsDragging(true);
    setDragItemId(shape.id);
    setDragOffset({ x: pos.x - shape.x, y: pos.y - shape.y });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = e => {
    if (!isDragging || dragItemId == null) return;
    const pos = getCursorPosition(e);
    const updatedShapes = shapesRef.current.map(s => {
      if (s.id === dragItemId) {
        return {
          ...s,
          x: pos.x - dragOffset.x,
          y: pos.y - dragOffset.y
        };
      }
      return s;
    });
    setShapes(updatedShapes);
    scheduleRender(updatedShapes);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragItemId(null);
      if (typeof onShapesChange === 'function') {
        onShapesChange(shapesRef.current);
      }
    }
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Initial render and when grid or shapes change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    renderCanvas(ctx);
  }, [data.grid, shapes]);

  // ResizeObserver to handle container resize
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;
    const resizeCanvas = () => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
      renderCanvas(ctx);
    };
    resizeCanvas();
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [data.grid]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        cursor: isDragging ? 'grabbing' : 'crosshair'
      }}
      onMouseDown={handleMouseDown}
    />
  );
}

export default BlueprintCanvas;