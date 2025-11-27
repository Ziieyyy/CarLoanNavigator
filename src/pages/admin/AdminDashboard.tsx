import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Car, Building, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [carsCount, usersCount] = await Promise.all([
      supabase.from('cars').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalCars: carsCount.count || 0,
      totalUsers: usersCount.count || 0,
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCars}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Cars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/cars">
                <Button className="w-full">View All Cars</Button>
              </Link>
              <Link to="/admin/cars/new">
                <Button variant="secondary" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Car
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Banks</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/admin/banks">
                <Button className="w-full">View All Banks</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;