import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Pencil, Trash2, Plus, ArrowLeft, ArrowUpDown, Search } from 'lucide-react';
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

type SortField = 'brand' | 'model' | 'year' | 'price';
type SortDirection = 'asc' | 'desc';

const ManageCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('brand');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingImageUrl, setEditingImageUrl] = useState<{ id: string; url: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    // This ensures that when cars data changes, we update the display
    // The sorting and filtering is handled by getSortedCars()
  }, [cars]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load cars',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedCars = () => {
    const filtered = cars.filter((car) => {
      // Filter by category
      if (selectedCategory !== 'all' && car.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Filter by search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return car.brand.toLowerCase().includes(term) || car.model.toLowerCase().includes(term);
    });

    return [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'brand':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        case 'model':
          aValue = a.model.toLowerCase();
          bValue = b.model.toLowerCase();
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully',
      });
      
      fetchCars();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleImageUrlChange = (carId: string, url: string) => {
    setEditingImageUrl({ id: carId, url });
  };

  const saveImageUrl = async () => {
    if (!editingImageUrl) return;

    try {
      const { error } = await supabase
        .from('cars')
        .update({ image_url: editingImageUrl.url || null })
        .eq('id', editingImageUrl.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Image URL updated successfully',
      });

      // Update the local state
      const updatedCars = cars.map(car => 
        car.id === editingImageUrl.id 
          ? { ...car, image_url: editingImageUrl.url || null } 
          : car
      );
      setCars(updatedCars);

      setEditingImageUrl(null);
      // fetchCars(); // No need to refresh from database since we updated locally
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const cancelImageUrlEdit = () => {
    setEditingImageUrl(null);
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

  const sortedCars = getSortedCars();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('admin.backToDashboard')}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{t('admin.manageVehicles')}</h1>
          <p className="text-muted-foreground">{t('admin.manageVehiclesDesc')}</p>
        </div>

        {/* Search Bar and Add Button */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar - Left Side */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('admin.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  pl-10 pr-4 py-2.5 rounded-xl
                  focus:border-red-600 focus:ring-2 focus:ring-red-600/20
                  shadow-sm
                  transition-all duration-200
                "
              />
            </div>
            
            {/* Add New Vehicle Button - Right Side */}
            <Link to="/admin/cars/new">
              <Button className="
                rounded-full px-6 py-2.5 text-sm font-medium
                transition-all duration-200 flex items-center gap-2
                bg-[#800000] text-white shadow-lg shadow-[#800000]/30 hover:bg-[#5a0000] border-0
              ">
                <Plus className="h-4 w-4" />
                {t('admin.addNewVehicle')}
              </Button>
            </Link>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className={`
                rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategory === 'all' 
                  ? 'bg-[#800000] text-white hover:bg-[#5a0000] border-0' 
                  : 'hover:bg-[#800000]/10 hover:text-[#800000] hover:border-[#800000]'
                }
              `}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === 'car' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('car')}
              className={`
                rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategory === 'car' 
                  ? 'bg-[#800000] text-white hover:bg-[#5a0000] border-0' 
                  : 'hover:bg-[#800000]/10 hover:text-[#800000] hover:border-[#800000]'
                }
              `}
            >
              Car
            </Button>
            <Button
              variant={selectedCategory === 'motorcycle' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('motorcycle')}
              className={`
                rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategory === 'motorcycle' 
                  ? 'bg-[#800000] text-white hover:bg-[#5a0000] border-0' 
                  : 'hover:bg-[#800000]/10 hover:text-[#800000] hover:border-[#800000]'
                }
              `}
            >
              Motorcycle
            </Button>
            <Button
              variant={selectedCategory === 'van' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('van')}
              className={`
                rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategory === 'van' 
                  ? 'bg-[#800000] text-white hover:bg-[#5a0000] border-0' 
                  : 'hover:bg-[#800000]/10 hover:text-[#800000] hover:border-[#800000]'
                }
              `}
            >
              Van
            </Button>
            <Button
              variant={selectedCategory === 'truck' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('truck')}
              className={`
                rounded-full px-6 py-2 text-sm font-medium transition-all duration-200
                ${selectedCategory === 'truck' 
                  ? 'bg-[#800000] text-white hover:bg-[#5a0000] border-0' 
                  : 'hover:bg-[#800000]/10 hover:text-[#800000] hover:border-[#800000]'
                }
              `}
            >
              Truck
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('brand')}>
                    <div className="flex items-center">
                      {t('admin.brand')}
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'brand' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('model')}>
                    <div className="flex items-center">
                      {t('admin.model')}
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'model' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('year')}>
                    <div className="flex items-center">
                      {t('admin.year')}
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'year' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      {t('admin.price')}
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'price' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead>{t('admin.imageUrl')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {t('admin.noVehiclesMatch', { term: searchTerm })}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.brand}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>RM{car.price.toLocaleString()}</TableCell>
                      <TableCell>
                        {editingImageUrl?.id === car.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingImageUrl.url || ''}
                              onChange={(e) => handleImageUrlChange(car.id, e.target.value)}
                              className="flex-1"
                              placeholder={t('admin.enterImageUrl')}
                            />
                            <Button size="sm" onClick={saveImageUrl}>
                              {t('admin.save')}
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelImageUrlEdit}>
                              {t('admin.cancel')}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {car.image_url ? (
                              <div className="max-w-xs truncate text-sm text-muted-foreground">
                                {car.image_url}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">{t('admin.noImage')}</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImageUrlChange(car.id, car.image_url || '')}
                            >
                              {t('admin.edit')}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link to={`/admin/cars/edit/${car.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(car.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('admin.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageCars;