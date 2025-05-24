import React from 'react';

interface PageHeadingProps {
  title: string;
  description: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-6">
      <h1 className="font-heading text-3xl font-extrabold mb-2">{title}</h1>
      <p className="text-base text-muted-foreground">{description}</p>
    </div>
  );
};

export default PageHeading;
