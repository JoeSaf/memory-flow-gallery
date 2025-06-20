
import React from 'react';

interface ContentSectionProps {
  title: string;
  content: string;
}

export const ContentSection = ({ title, content }: ContentSectionProps) => {
  return (
    <section className="text-center animate-gentle-fade">
      <h2 className="text-3xl md:text-4xl font-poppins font-light text-charcoal mb-6">
        {title}
      </h2>
      <p className="text-lg md:text-xl font-inter text-slate-gray leading-relaxed max-w-3xl mx-auto opacity-90">
        {content}
      </p>
    </section>
  );
};
