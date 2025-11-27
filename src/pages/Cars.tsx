import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Car as CarIcon } from 'lucide-react';

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
    if (activeFilter === 'All') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter(car => car.category === activeFilter));
    }
  }, [activeFilter, cars]);

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

        {/* Category Filters with Curved Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveFilter(category)}
                variant={activeFilter === category ? "default" : "outline"}
                className="rounded-full px-4 py-2"
              >
                {category === 'All' ? t('common.all') : 
                 category === 'Car' ? t('common.car') : 
                 category === 'Van' ? t('common.van') : 
                 t('common.truck')}
              </Button>
            ))}
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
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <CarIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-xl mb-2">
                    {car.brand} {car.model}
                  </CardTitle>
                  <p className="text-muted-foreground mb-1">{t('cars.year')}: {car.year}</p>
                  <p className="text-2xl font-bold text-primary">
                    RM{car.price.toLocaleString()}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link to={`/cars/${car.id}`} className="flex-1">
                    <Button className="w-full">{t('cars.viewDetails')}</Button>
                  </Link>
                  <Link to={`/calculator?carId=${car.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">{t('cars.calculateLoan')}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cars;