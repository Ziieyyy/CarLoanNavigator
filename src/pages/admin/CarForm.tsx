import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

const CarForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Car');
  const [imageUrl, setImageUrl] = useState('');
  const [engine, setEngine] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [topSpeed, setTopSpeed] = useState('');
  const [safetyFeatures, setSafetyFeatures] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setBrand(data.brand);
      setModel(data.model);
      setYear(data.year.toString());
      setPrice(data.price.toString());
      setCategory(data.category);
      setImageUrl(data.image_url || '');
      setEngine(data.engine || '');
      setHorsepower(data.horsepower || '');
      setFuelConsumption(data.fuel_consumption || '');
      setAcceleration(data.acceleration || '');
      setTopSpeed(data.top_speed || '');
      setSafetyFeatures(data.safety_features || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load car details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!brand.trim() || !model.trim() || !year || !price) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields (Brand, Model, Year, Price)',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Validate year range
      const yearNum = parseInt(year);
      if (yearNum < 1900 || yearNum > 2100) {
        toast({
          title: 'Validation Error',
          description: 'Year must be between 1900 and 2100',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Validate price
      const priceNum = parseFloat(price);
      if (priceNum <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Price must be greater than 0',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const carData = {
        brand,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        category,
        image_url: imageUrl || null,
        engine: engine || null,
        horsepower: horsepower || null,
        fuel_consumption: fuelConsumption || null,
        acceleration: acceleration || null,
        top_speed: topSpeed || null,
        safety_features: safetyFeatures || null,
      };

      console.log('Submitting car data:', carData);

      if (isEdit) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', id);

        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Car updated successfully',
        });
      } else {
        const { data, error } = await supabase
          .from('cars')
          .insert([carData])
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Created car:', data);
        toast({
          title: 'Success',
          description: 'Car created successfully',
        });
      }

      navigate('/admin/cars');
    } catch (error: any) {
      console.error('Full error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEdit ? 'update' : 'create'} car`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Car' : 'Add New Car'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SECTION A: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Toyota"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Camry"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (RM) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="150000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* SECTION B: Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specifications</h3>
                <div className="space-y-2">
                  <Label htmlFor="engine">Engine</Label>
                  <Input
                    id="engine"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    placeholder="2.0L Inline-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horsepower">Horsepower</Label>
                  <Input
                    id="horsepower"
                    value={horsepower}
                    onChange={(e) => setHorsepower(e.target.value)}
                    placeholder="203 hp"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelConsumption">Fuel Consumption</Label>
                  <Input
                    id="fuelConsumption"
                    value={fuelConsumption}
                    onChange={(e) => setFuelConsumption(e.target.value)}
                    placeholder="6.5L/100km"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acceleration">Acceleration (0-100 km/h)</Label>
                  <Input
                    id="acceleration"
                    value={acceleration}
                    onChange={(e) => setAcceleration(e.target.value)}
                    placeholder="8.5 seconds"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topSpeed">Top Speed</Label>
                  <Input
                    id="topSpeed"
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(e.target.value)}
                    placeholder="200 km/h"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="safetyFeatures">Safety Features</Label>
                  <Textarea
                    id="safetyFeatures"
                    value={safetyFeatures}
                    onChange={(e) => setSafetyFeatures(e.target.value)}
                    placeholder="ABS, Airbags, Stability Control..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Car' : 'Add Car'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/cars')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default CarForm;