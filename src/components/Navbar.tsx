import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Car, LogOut, User, Settings, LayoutDashboard, Languages, Menu, X, Moon, Sun } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    setShowLogoutDialog(false);
    await signOut();
    toast({
      title: 'Logged out successfully',
      description: 'You have been signed out of your account.',
    });
    // Small delay to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/auth', { replace: true });
    }, 100);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
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
    <nav className="border-b border-border bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Car className="h-8 w-8" />
            <span>AUTO FINANCE CALCULATOR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation links - always visible */}
            {navItems.map((item, index) => (
              <Link key={index} to={item.link}>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-transparent font-medium">
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Theme toggle - always visible */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-foreground hover:text-primary hover:bg-transparent"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Language toggle - always visible */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              className="text-foreground hover:text-primary hover:bg-transparent"
            >
              <Languages className="h-5 w-5" />
            </Button>
            
            {/* User-specific actions */}
            {user ? (
              <>
                <Link to="/profile">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-foreground hover:text-primary hover:bg-transparent"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={confirmLogout}
                  className="text-foreground hover:text-primary hover:bg-transparent"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  {t('navbar.login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Navigation links - always visible */}
              {navItems.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.link} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Language toggle - always visible */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
              >
                {language === 'en' ? 'Bahasa Malaysia' : 'English'}
              </button>
              
              {/* User-specific actions */}
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navbar.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      confirmLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('navbar.logoutConfirmTitle') || 'Confirm Logout'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('navbar.logoutConfirmMessage') || 'Are you sure you want to log out?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('navbar.cancel') || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              {t('navbar.logout') || 'Log Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};