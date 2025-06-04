import React from 'react';

const Header: React.FC = () => (
  <header className="text-center mb-8">
    <img
      src="https://storage.googleapis.com/newleafliberals/NewLeafLogo.webp"
      alt="New Leaf Liberals"
      width={600}
      className="max-w-[80%] mx-auto mb-2 relative left-4"
    />
    <p className="text-base italic"><i>A grassroots movement for a renewed Ontario Liberal Party</i></p>
  </header>
);

export default Header; 