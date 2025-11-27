import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface Bank {
  id: string;
  name: string;
  interest_rate: number;
  advantages: string[] | null;
  disadvantages: string[] | null;
  website: string | null;
}

const BankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBank();
  }, [id]);

  const fetchBank = async () => {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('id, name, interest_rate, advantages, disadvantages, website')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBank(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load bank details',
        variant: 'destructive',
      });
      navigate('/calculator');
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/calculator">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calculator
          </Button>
        </Link>

        {bank && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">{bank.name}</h1>
              <p className="text-muted-foreground">Current Interest Rate: {bank.interest_rate}%</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advantages (Kelebihan)</CardTitle>
                </CardHeader>
                <CardContent>
                  {bank.advantages && bank.advantages.length > 0 ? (
                    <ul className="space-y-2">
                      {bank.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No advantages available for this bank.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disadvantages (Kelemahan)</CardTitle>
                </CardHeader>
                <CardContent>
                  {bank.disadvantages && bank.disadvantages.length > 0 ? (
                    <ul className="space-y-2">
                      {bank.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span>{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No disadvantages available for this bank.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Official Website</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">For more information and to apply for a loan, visit the official website:</p>
                {bank.website ? (
                  <a 
                    href={bank.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {bank.website}
                  </a>
                ) : (
                  <p className="text-muted-foreground">No website available for this bank.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default BankDetail;