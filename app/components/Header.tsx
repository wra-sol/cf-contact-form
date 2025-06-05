import React from 'react';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-[var(--box-background)]/80 backdrop-blur-md w-full flex flex-col items-center py-4 mb-8 shadow-sm">
      <img
        src={`https://storage.googleapis.com/newleafliberals/NewLeafLogo-${isDarkMode ? 'dark' : 'light'}.png`}
        alt="New Leaf Liberals"
        width={220}
        className="max-w-[70vw] md:max-w-[220px] mx-auto mb-2 transition-all duration-300"
      />
      <p className="text-sm md:text-base italic text-[var(--text-primary)]"><i>A grassroots movement for a renewed Ontario Liberal Party</i></p>
      {/* Future nav can go here */}
    </header>
  );
};

export default Header;