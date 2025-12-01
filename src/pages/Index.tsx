import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Car, Calculator, TrendingUp, Shield, Clock, Building, Moon, Sun, ChevronLeft, ChevronRight, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';

const Index = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', () => {
      setCurrentCategory(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const categories = [
    {
      name: t('common.car'),
      description: t('index.categoryCarDesc'),
      image: '/images/car.png'
    },
    {
      name: t('common.motorcycle'),
      description: t('index.categoryMotorcycleDesc'),
      image: '/images/vespa.png'
    },
    {
      name: t('common.van'),
      description: t('index.categoryVanDesc'),
      image: '/images/van.png'
    },
    {
      name: t('common.truck'),
      description: t('index.categoryTruckDesc'),
      image: '/images/truck.png'
    }
  ];

  const nextCategory = () => {
    setCurrentCategory((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategory((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto h-screen scroll-smooth snap-container">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <Car className="h-8 w-8" />
              AUTO FINANCE CALCULATOR
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a href="#home">
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  {t('index.home')}
                </Button>
              </a>
              <a href="#loan-rates">
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  {t('index.loanRates')}
                </Button>
              </a>
              <a href="#about">
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  {t('index.about')}
                </Button>
              </a>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-foreground hover:text-primary"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleLanguage}
                className="text-foreground hover:text-primary"
                title={language === 'en' ? 'Switch to Malay' : 'Tukar ke Bahasa Inggeris'}
              >
                <Languages className="h-5 w-5" />
              </Button>
              <Link to="/cars">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
                  {user ? t('index.dashboard') : t('index.login')}
                </Button>
              </Link>
            </div>
            {/* Mobile menu */}
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
                onClick={toggleLanguage}
                className="text-foreground"
                title={language === 'en' ? 'Switch to Malay' : 'Tukar ke Bahasa Inggeris'}
              >
                <Languages className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative bg-gradient-to-b from-muted/50 to-background overflow-hidden min-h-screen flex items-center snap-section">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Auto Finance Calculator
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {t('index.heroTitle')}<br />
                <span className="text-primary">{t('index.heroSubtitle')}</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
                {t('index.heroDesc')}
              </p>
              <Link to="/calculator">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-lg">
                  {t('index.compareRates')}
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop" 
                  alt="Car" 
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div id="about" className="bg-[#800000] px-4 py-12">
        <div className="container mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">{t('index.whyChooseUs')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow border-border">
            <CardContent className="pt-8 pb-8">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('index.fastApproval')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('index.fastApprovalDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-border">
            <CardContent className="pt-8 pb-8">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('index.topLenders')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('index.topLendersDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-border">
            <CardContent className="pt-8 pb-8">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('index.secureProcess')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('index.secureProcessDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div id="loan-rates" className="bg-muted/30 py-20 snap-section overflow-hidden">
        <div className="w-full">
          <h2 className="text-4xl font-bold text-center mb-16">{t('index.browseByCategory')}</h2>
          
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {categories.map((category, index) => (
                <CarouselItem key={index}>
                  <div className="text-center px-4">
                    {/* Full width image */}
                    <div className="relative mb-8 w-full bg-gradient-to-b from-transparent to-muted/20">
                      <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-[500px] lg:h-[700px] object-contain drop-shadow-2xl"
                      />
                    </div>
                    
                    {/* Category Info */}
                    <div className="container mx-auto max-w-5xl">
                      <h3 className="text-4xl lg:text-5xl font-bold italic mb-6">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-center gap-6 mb-8">
                        <button
                          onClick={() => carouselApi?.scrollPrev()}
                          className="bg-muted/10 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full p-3 transition-all duration-300 flex-shrink-0 hover:scale-110 hover:shadow-lg"
                          aria-label="Previous category"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        <p className="text-lg text-muted-foreground max-w-2xl select-none">
                          {category.description}
                        </p>
                        
                        <button
                          onClick={() => carouselApi?.scrollNext()}
                          className="bg-muted/10 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full p-3 transition-all duration-300 flex-shrink-0 hover:scale-110 hover:shadow-lg"
                          aria-label="Next category"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </div>

                      <Link to="/cars">
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-lg">
                          {t('index.viewOffers')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Category Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {categories.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentCategory 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">{t('index.copyright')}</p>
            </div>
            <div className="flex gap-6">
              <a href="#home" className="text-sm text-muted-foreground hover:text-primary">
                {t('index.home')}
              </a>
              <a href="#loan-rates" className="text-sm text-muted-foreground hover:text-primary">
                {t('index.loanRates')}
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-primary">
                {t('index.about')}
              </a>
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary">
                {t('index.contact')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;