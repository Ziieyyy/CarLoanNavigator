import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Car, Users, Plus, Building2, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBanks: 0,
    recentCarsAdded: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [carsCount, usersCount, banksCount, recentCars] = await Promise.all([
      supabase.from('cars').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('banks').select('*', { count: 'exact', head: true }),
      supabase.from('cars').select('id').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    setStats({
      totalCars: carsCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalBanks: banksCount.count || 0,
      recentCarsAdded: recentCars.data?.length || 0,
    });
    
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 transition-colors duration-300 ease-in-out">
        {/* Header with Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your car loan platform</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link to="/admin/cars/new">
              <Button className="rounded-xl hover:bg-primary/90 transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Add Car
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cars</CardTitle>
              <Car className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCars}</div>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.recentCarsAdded} this week
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated at: {lastUpdated || 'loading...'}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Banks</CardTitle>
              <Building2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBanks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active partners
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Activity</CardTitle>
              <Activity className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalCars + stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total entries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-blue-500" />
                <CardTitle className="text-lg font-medium">Manage Cars</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                View and manage all vehicles in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Link to="/admin/cars">
                <Button className="w-full rounded-xl hover:bg-primary/90 transition-all duration-200">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View All Cars
                </Button>
              </Link>
              <Link to="/admin/cars/new">
                <Button variant="outline" className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 transition-all duration-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Car
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-emerald-500" />
                <CardTitle className="text-lg font-medium">Manage Banks</CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Configure banking partners and loan rates
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Link to="/admin/banks">
                <Button className="w-full rounded-xl hover:bg-primary/90 transition-all duration-200">
                  <Building2 className="mr-2 h-4 w-4" />
                  View All Banks
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;