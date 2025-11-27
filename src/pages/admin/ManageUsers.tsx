import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'user';
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, 'admin' | 'user'>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('*'),
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (rolesResponse.error) throw rolesResponse.error;

      setUsers(usersResponse.data || []);
      
      const rolesMap: Record<string, 'admin' | 'user'> = {};
      rolesResponse.data?.forEach((role: UserRole) => {
        if (role.role === 'admin') {
          rolesMap[role.user_id] = 'admin';
        } else if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = 'user';
        }
      });
      setUserRoles(rolesMap);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const currentRole = userRoles[userId] || 'user';
      
      if (newRole === 'admin' && currentRole !== 'admin') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (error) throw error;
      } else if (newRole === 'user' && currentRole === 'admin') {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/admin">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Manage Bank</h1>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={userRoles[user.id] || 'user'}
                        onValueChange={(value: 'admin' | 'user') =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ManageUsers;
