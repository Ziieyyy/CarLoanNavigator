import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

interface Bank {
  id: string;
  name: string;
  interest_rate: number;
  advantages: string[] | null;
  disadvantages: string[] | null;
  website: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ManageBanks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [newBank, setNewBank] = useState({ 
    name: '', 
    interestRate: '',
    website: '',
    advantages: [''],
    disadvantages: ['']
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('name');

      if (error) throw error;
      setBanks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load banks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBank = async () => {
    try {
      if (!newBank.name.trim() || !newBank.interestRate) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      // Filter out empty advantages and disadvantages
      const advantages = newBank.advantages.filter(a => a.trim() !== '');
      const disadvantages = newBank.disadvantages.filter(d => d.trim() !== '');

      const { data, error } = await supabase
        .from('banks')
        .insert([{
          name: newBank.name.trim(),
          interest_rate: parseFloat(newBank.interestRate),
          website: newBank.website.trim() || null,
          advantages: advantages.length > 0 ? advantages : null,
          disadvantages: disadvantages.length > 0 ? disadvantages : null
        }])
        .select();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Bank added successfully',
      });

      setNewBank({ 
        name: '', 
        interestRate: '',
        website: '',
        advantages: [''],
        disadvantages: ['']
      });
      fetchBanks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBank = async () => {
    try {
      if (!editingBank) return;
      
      if (!editingBank.name.trim() || editingBank.interest_rate <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields with valid values',
          variant: 'destructive',
        });
        return;
      }

      // Filter out empty advantages and disadvantages
      const advantages = editingBank.advantages?.filter(a => a.trim() !== '') || [];
      const disadvantages = editingBank.disadvantages?.filter(d => d.trim() !== '') || [];

      const { error } = await supabase
        .from('banks')
        .update({
          name: editingBank.name.trim(),
          interest_rate: editingBank.interest_rate,
          website: editingBank.website?.trim() || null,
          advantages: advantages.length > 0 ? advantages : null,
          disadvantages: disadvantages.length > 0 ? disadvantages : null
        })
        .eq('id', editingBank.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Bank updated successfully',
      });

      setEditingBank(null);
      fetchBanks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', bankId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Bank deleted successfully',
      });

      fetchBanks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Functions to handle advantages and disadvantages arrays
  const addAdvantageField = (isEditing: boolean = false) => {
    if (isEditing && editingBank) {
      setEditingBank({
        ...editingBank,
        advantages: [...(editingBank.advantages || []), '']
      });
    } else {
      setNewBank({
        ...newBank,
        advantages: [...newBank.advantages, '']
      });
    }
  };

  const removeAdvantageField = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingBank && editingBank.advantages) {
      const newAdvantages = [...editingBank.advantages];
      newAdvantages.splice(index, 1);
      setEditingBank({
        ...editingBank,
        advantages: newAdvantages
      });
    } else {
      const newAdvantages = [...newBank.advantages];
      newAdvantages.splice(index, 1);
      setNewBank({
        ...newBank,
        advantages: newAdvantages
      });
    }
  };

  const updateAdvantageField = (index: number, value: string, isEditing: boolean = false) => {
    if (isEditing && editingBank && editingBank.advantages) {
      const newAdvantages = [...editingBank.advantages];
      newAdvantages[index] = value;
      setEditingBank({
        ...editingBank,
        advantages: newAdvantages
      });
    } else {
      const newAdvantages = [...newBank.advantages];
      newAdvantages[index] = value;
      setNewBank({
        ...newBank,
        advantages: newAdvantages
      });
    }
  };

  const addDisadvantageField = (isEditing: boolean = false) => {
    if (isEditing && editingBank) {
      setEditingBank({
        ...editingBank,
        disadvantages: [...(editingBank.disadvantages || []), '']
      });
    } else {
      setNewBank({
        ...newBank,
        disadvantages: [...newBank.disadvantages, '']
      });
    }
  };

  const removeDisadvantageField = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingBank && editingBank.disadvantages) {
      const newDisadvantages = [...editingBank.disadvantages];
      newDisadvantages.splice(index, 1);
      setEditingBank({
        ...editingBank,
        disadvantages: newDisadvantages
      });
    } else {
      const newDisadvantages = [...newBank.disadvantages];
      newDisadvantages.splice(index, 1);
      setNewBank({
        ...newBank,
        disadvantages: newDisadvantages
      });
    }
  };

  const updateDisadvantageField = (index: number, value: string, isEditing: boolean = false) => {
    if (isEditing && editingBank && editingBank.disadvantages) {
      const newDisadvantages = [...editingBank.disadvantages];
      newDisadvantages[index] = value;
      setEditingBank({
        ...editingBank,
        disadvantages: newDisadvantages
      });
    } else {
      const newDisadvantages = [...newBank.disadvantages];
      newDisadvantages[index] = value;
      setNewBank({
        ...newBank,
        disadvantages: newDisadvantages
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
        
        <h1 className="text-4xl font-bold mb-8">Manage Banks</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="Enter bank name"
                  value={newBank.name}
                  onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter interest rate"
                  value={newBank.interestRate}
                  onChange={(e) => setNewBank({...newBank, interestRate: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={newBank.website}
                  onChange={(e) => setNewBank({...newBank, website: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Advantages (Kelebihan)</Label>
                {newBank.advantages.map((advantage, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter advantage"
                      value={advantage}
                      onChange={(e) => updateAdvantageField(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeAdvantageField(index)}
                      disabled={newBank.advantages.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addAdvantageField()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Advantage
                </Button>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Disadvantages (Kelemahan)</Label>
                {newBank.disadvantages.map((disadvantage, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter disadvantage"
                      value={disadvantage}
                      onChange={(e) => updateDisadvantageField(index, e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeDisadvantageField(index)}
                      disabled={newBank.disadvantages.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addDisadvantageField()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Disadvantage
                </Button>
              </div>
              
              <div className="md:col-span-2">
                <Button onClick={handleAddBank} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bank
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banks List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Interest Rate (%)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banks.map((bank) => (
                  <TableRow key={bank.id}>
                    {editingBank?.id === bank.id ? (
                      <>
                        <TableCell colSpan={3}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div className="space-y-2">
                              <Label>Bank Name</Label>
                              <Input
                                value={editingBank.name}
                                onChange={(e) => setEditingBank({...editingBank, name: e.target.value})}
                                className="w-full"
                                placeholder="Enter bank name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Interest Rate (%)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingBank.interest_rate}
                                onChange={(e) => setEditingBank({...editingBank, interest_rate: parseFloat(e.target.value) || 0})}
                                className="w-full"
                                placeholder="Enter interest rate"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Website</Label>
                              <Input
                                type="url"
                                placeholder="https://example.com"
                                value={editingBank.website || ''}
                                onChange={(e) => setEditingBank({...editingBank, website: e.target.value})}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Advantages (Kelebihan)</Label>
                              {(editingBank.advantages || ['']).map((advantage, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    placeholder="Enter advantage"
                                    value={advantage}
                                    onChange={(e) => {
                                      const newAdvantages = [...(editingBank.advantages || [])];
                                      newAdvantages[index] = e.target.value;
                                      setEditingBank({
                                        ...editingBank,
                                        advantages: newAdvantages
                                      });
                                    }}
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                      const newAdvantages = [...(editingBank.advantages || [])];
                                      newAdvantages.splice(index, 1);
                                      setEditingBank({
                                        ...editingBank,
                                        advantages: newAdvantages.length > 0 ? newAdvantages : ['']
                                      });
                                    }}
                                    disabled={(editingBank.advantages || []).length <= 1 && (editingBank.advantages || []).every(a => a === '')}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingBank({
                                  ...editingBank,
                                  advantages: [...(editingBank.advantages || []), '']
                                })}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Advantage
                              </Button>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label>Disadvantages (Kelemahan)</Label>
                              {(editingBank.disadvantages || ['']).map((disadvantage, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    placeholder="Enter disadvantage"
                                    value={disadvantage}
                                    onChange={(e) => {
                                      const newDisadvantages = [...(editingBank.disadvantages || [])];
                                      newDisadvantages[index] = e.target.value;
                                      setEditingBank({
                                        ...editingBank,
                                        disadvantages: newDisadvantages
                                      });
                                    }}
                                  />
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => {
                                      const newDisadvantages = [...(editingBank.disadvantages || [])];
                                      newDisadvantages.splice(index, 1);
                                      setEditingBank({
                                        ...editingBank,
                                        disadvantages: newDisadvantages.length > 0 ? newDisadvantages : ['']
                                      });
                                    }}
                                    disabled={(editingBank.disadvantages || []).length <= 1 && (editingBank.disadvantages || []).every(d => d === '')}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingBank({
                                  ...editingBank,
                                  disadvantages: [...(editingBank.disadvantages || []), '']
                                })}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Disadvantage
                              </Button>
                            </div>
                            
                            <div className="md:col-span-2 flex justify-end gap-2">
                              <Button onClick={handleUpdateBank}>Save</Button>
                              <Button variant="outline" onClick={() => setEditingBank(null)}>Cancel</Button>
                            </div>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{bank.name}</TableCell>
                        <TableCell>{bank.interest_rate.toFixed(2)}%</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            onClick={() => setEditingBank(bank)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBank(bank.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </>
                    )}
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

export default ManageBanks;