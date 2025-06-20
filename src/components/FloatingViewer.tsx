
import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Heart } from 'lucide-react';
import { Photo } from './PhotoGallery';

interface FloatingViewerProps {
  photo: Photo;
  onClose: () => void;
}

export const FloatingViewer = ({ photo, onClose }: FloatingViewerProps) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = position.x + (e.clientX - dragStart.x);
      const newY = position.y + (e.clientY - dragStart.y);
      
      setPosition({ x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === viewerRef.current || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.filename;
    link.download = `${photo.title}.jpg`;
    link.click();
    console.log('Download initiated for:', photo.title);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40 animate-gentle-fade"
        onClick={onClose}
      />
      
      {/* Floating Viewer */}
      <div
        ref={viewerRef}
        className="fixed z-50 bg-warm-cream rounded-3xl shadow-2xl overflow-hidden border border-foggy-blue/20 animate-gentle-fade"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: 'min(90vw, 600px)',
          maxHeight: '90vh',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header with drag handle */}
        <div className="drag-handle bg-slate-gray/10 p-4 border-b border-foggy-blue/10 flex items-center justify-between">
          <div>
            <h2 className="font-poppins font-semibold text-charcoal text-xl">
              {photo.title}
            </h2>
            <p className="text-slate-gray text-sm">
              {new Date(photo.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'bg-dusty-rose text-warm-cream' : 'bg-foggy-blue/20 text-slate-gray hover:bg-dusty-rose/20'
              }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-foggy-blue/20 text-slate-gray hover:bg-slate-gray/20 transition-colors"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-dusty-rose/20 text-slate-gray hover:bg-dusty-rose/40 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <img
            src={photo.filename}
            alt={photo.title}
            className="w-full h-auto max-h-[60vh] object-contain bg-gradient-to-br from-foggy-blue/5 to-dusty-rose/5"
          />
        </div>

        {/* Caption and metadata */}
        <div className="p-6 space-y-4">
          <blockquote className="text-charcoal font-inter italic text-lg leading-relaxed border-l-4 border-dusty-rose pl-4">
            "{photo.caption}"
          </blockquote>
          
          <div className="flex items-center gap-3">
            <span className="bg-dusty-rose/20 text-charcoal px-3 py-1 rounded-full text-sm capitalize">
              {photo.season}
            </span>
            <span className="bg-foggy-blue/20 text-charcoal px-3 py-1 rounded-full text-sm">
              {photo.tag}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
