import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Car as CarIcon, Gauge, Fuel, Zap, Search, Truck, Box } from 'lucide-react';

interface Car {
  acceleration: string | null;
  id: string;
  brand: string;
  category: string;
  disclaimer_text: string | null;
  engine: string | null;
  financing_text: string | null;
  fuel_consumption: string | null;
  horsepower: string | null;
  image_url: string | null;
  model: string;
  model_name: string | null;
  price: number;
  safety_features: string | null;
  top_speed: string | null;
  year: number;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: t('cars.loadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = cars;
    
    // Filter by category
    if (activeFilter !== 'All') {
      filtered = filtered.filter(car => car.category === activeFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(car => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          car.brand.toLowerCase().includes(searchTerm) ||
          car.model.toLowerCase().includes(searchTerm) ||
          `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm)
        );
      });
    }
    
    setFilteredCars(filtered);
  }, [activeFilter, searchQuery, cars]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  const categories = ['All', 'Car', 'Van', 'Truck'];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('cars.available')}</h1>
          <p className="text-muted-foreground">{t('cars.browse')}</p>
        </div>

        {/* Category Filters with Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Buttons - Left Side */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isActive = activeFilter === category;
                const getCategoryIcon = () => {
                  if (category === 'Car') return <CarIcon className="h-4 w-4" />;
                  if (category === 'Van') return <Box className="h-4 w-4" />;
                  if (category === 'Truck') return <Truck className="h-4 w-4" />;
                  return null;
                };
                
                return (
                  <Button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`
                      rounded-full px-6 py-2.5 text-sm font-medium
                      transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? 'bg-[#800000] text-white shadow-lg shadow-[#800000]/30 hover:bg-[#5a0000] border-0' 
                        : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 hover:border-red-300 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    {getCategoryIcon()}
                    {category === 'All' ? t('common.all') : 
                     category === 'Car' ? t('common.car') : 
                     category === 'Van' ? t('common.van') : 
                     t('common.truck')}
                  </Button>
                );
              })}
            </div>
            
            {/* Search Bar - Right Side */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600 dark:text-gray-400" />
              <Input
                type="text"
                placeholder={t('cars.searchPlaceholder') || 'Search by car name, category, and more...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  pl-10 pr-4 py-2.5 rounded-xl
                  bg-red-50 border border-red-200 text-red-900 placeholder:text-red-400
                  focus:border-red-600 focus:ring-2 focus:ring-red-600/20
                  hover:border-red-300 shadow-sm
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500
                  dark:focus:border-red-600 dark:hover:border-gray-600
                  transition-all duration-200
                "
              />
            </div>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">{t('cars.noAvailable')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="group perspective-1000 h-[420px]">
                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                  {/* Front of Card */}
                  <Card className="absolute w-full h-full backface-hidden overflow-hidden shadow-lg">
                    <div className="relative h-full flex flex-col">
                      <div className="flex-1 relative bg-gray-100 dark:bg-white">
                        {car.image_url ? (
                          <img
                            src={car.image_url}
                            alt={`${car.brand} ${car.model}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full bg-muted flex items-center justify-center">
                            <CarIcon className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4 pb-4 bg-background/95 backdrop-blur-sm">
                        <CardTitle className="text-xl mb-2">
                          {car.brand} {car.model}
                        </CardTitle>
                        <p className="text-muted-foreground mb-1">{t('cars.year')}: {car.year}</p>
                        <p className="text-2xl font-bold text-primary">
                          RM{car.price.toLocaleString()}
                        </p>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Back of Card */}
                  <Card className="absolute w-full h-full backface-hidden rotate-y-180 overflow-hidden shadow-lg bg-gradient-to-br from-[#800000] to-[#5a0000]">
                    <CardContent className="pt-6 pb-4 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-6 text-center text-white">
                          {car.brand} {car.model}
                        </h3>
                        <div className="space-y-3">
                          {/* Engine */}
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-3 rounded-full">
                              <CarIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/70">{t('cars.engine')}</p>
                              <p className="font-semibold text-white">{car.engine || t('cars.notSpecified')}</p>
                            </div>
                          </div>

                          {/* Horsepower */}
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-3 rounded-full">
                              <Zap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/70">{t('cars.horsepower')}</p>
                              <p className="font-semibold text-white">{car.horsepower || t('cars.notSpecified')}</p>
                            </div>
                          </div>

                          {/* Top Speed */}
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-3 rounded-full">
                              <Gauge className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/70">{t('cars.topSpeed')}</p>
                              <p className="font-semibold text-white">{car.top_speed || t('cars.notSpecified')}</p>
                            </div>
                          </div>

                          {/* Fuel Economy */}
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-3 rounded-full">
                              <Fuel className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-white/70">{t('cars.fuelEconomy')}</p>
                              <p className="font-semibold text-white">{car.fuel_consumption || t('cars.notSpecified')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Buttons at bottom */}
                      <div className="flex gap-2 mt-4">
                        <Link to={`/cars/${car.id}`} className="flex-1">
                          <Button className="w-full bg-[#C17A7A] hover:bg-[#A66565] text-white">{t('cars.viewDetails')}</Button>
                        </Link>
                        <Link to={`/calculator?carId=${car.id}`} className="flex-1">
                          <Button variant="secondary" className="w-full bg-white text-[#800000] hover:bg-white/90">{t('cars.calculateLoan')}</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cars;