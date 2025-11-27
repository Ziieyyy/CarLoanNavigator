import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calculator, Car as CarIcon, Calendar, Fuel, Gauge, Zap } from 'lucide-react';

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

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: 'Error',
          description: t('carDetail.notFound'),
          variant: 'destructive',
        });
        navigate('/cars');
        return;
      }
      
      setCar(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: t('carDetail.loadError'),
        variant: 'destructive',
      });
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

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

  if (!car) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/cars')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('carDetail.backToCars')}
        </Button>

        {/* Split Screen Layout */}
        <div className="space-y-8">
          {/* Hero Image */}
          <Card>
            <CardContent className="p-0">
              {car.image_url ? (
                <img
                  src={car.image_url}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-muted flex items-center justify-center rounded-lg">
                  <CarIcon className="h-32 w-32 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Specifications Section (70%) */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-2">
                {car.brand} {car.model} ({car.year})
              </h1>
              <p className="text-xl text-muted-foreground mb-6 capitalize">{car.category}</p>
              
              {/* Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{t('carDetail.engine')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{car.engine || t('carDetail.notSpecified')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Gauge className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{t('carDetail.horsepower')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{car.horsepower || t('carDetail.notSpecified')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Gauge className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{t('carDetail.topSpeed')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{car.top_speed || t('carDetail.notSpecified')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Fuel className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{t('carDetail.fuelEconomy')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{car.fuel_consumption || t('carDetail.notSpecified')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{t('carDetail.year')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{car.year}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <CarIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{t('carDetail.category')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground capitalize">{car.category}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Sticky Card (30%) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">{t('carDetail.price')}</p>
                    <p className="text-4xl font-bold text-primary mb-4">
                      RM{car.price.toLocaleString()}
                    </p>
                    
                    <Card className="mb-4">
                      <CardContent className="pt-4">
                        <h3 className="font-semibold mb-2">{t('carDetail.financingAvailable')}</h3>
                        <p className="text-sm text-muted-foreground">
                          {car.financing_text || t('carDetail.financingDefault')}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Link to={`/calculator?carId=${car.id}`}>
                      <Button size="lg" className="w-full">
                        <Calculator className="mr-2 h-5 w-5" />
                        {t('carDetail.calculateLoan')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDetail;