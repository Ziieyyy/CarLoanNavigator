import { StaggeredMenu } from '../components/StaggeredMenu';

const StaggeredMenuDemo = () => {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Cars', ariaLabel: 'View our car listings', link: '/cars' },
    { label: 'Calculator', ariaLabel: 'Calculate your loan', link: '/calculator' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <div style={{ height: '100vh', background: '#1a1a1a' }}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#A50021', '#D12336']} // Using the new color scheme
        logoUrl="" // Add your logo path here
        accentColor="#D12336" // Using the bright red as accent color
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      
      <div className="flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">Staggered Menu Demo</h1>
      </div>
    </div>
  );
};

export default StaggeredMenuDemo;