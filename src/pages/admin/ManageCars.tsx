import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, ArrowLeft, ArrowUpDown } from 'lucide-react';
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
  const { toast } = useToast();

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
        description: 'Car deleted successfully',
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
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link to="/admin">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-4xl font-bold">Manage Cars</h1>
            </div>
            <Link to="/admin/cars/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Car
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            {searchTerm && (
              <Button variant="ghost" onClick={() => setSearchTerm('')}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('brand')}>
                    <div className="flex items-center">
                      Brand
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'brand' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('model')}>
                    <div className="flex items-center">
                      Model
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'model' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('year')}>
                    <div className="flex items-center">
                      Year
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'year' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'price' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableHead>
                  <TableHead>Image URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No cars match "{searchTerm}".
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
                              placeholder="Enter image URL"
                            />
                            <Button size="sm" onClick={saveImageUrl}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelImageUrlEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {car.image_url ? (
                              <div className="max-w-xs truncate text-sm text-muted-foreground">
                                {car.image_url}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No image</span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImageUrlChange(car.id, car.image_url || '')}
                            >
                              Edit
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the car.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageCars;