import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Car, LogOut, User, Settings, LayoutDashboard, Languages, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: t('navbar.cars'), link: '/cars' },
    { label: t('navbar.calculator'), link: '/calculator' },
    ...(isAdmin ? [{ label: t('navbar.admin'), link: '/admin' }] : []),
  ];

  return (
    // Updated navbar with new color scheme
    <nav className="border-b border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-8 w-8" />
            <span>Car Loan Navigator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {navItems.map((item, index) => (
                  <Link key={index} to={item.link}>
                    <Button variant="ghost" className="text-primary-foreground hover:bg-[#D12336] hover:text-white">
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleLanguage}
                  className="text-primary-foreground hover:bg-[#D12336] hover:text-white"
                >
                  <Languages className="h-4 w-4" />
                </Button>
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-primary-foreground hover:bg-[#D12336] hover:text-white"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSignOut}
                  className="text-primary-foreground hover:bg-[#D12336] hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-white text-[#A50021] hover:bg-[#D12336] hover:text-white">
                  {t('navbar.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-primary-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary text-primary-foreground border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {navItems.map((item, index) => (
                    <Link 
                      key={index} 
                      to={item.link} 
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D12336] hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D12336] hover:text-white"
                  >
                    {language === 'en' ? 'Bahasa Malaysia' : 'English'}
                  </button>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D12336] hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navbar.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D12336] hover:text-white"
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#D12336] hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};