import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';
import { formatNumber, parseFormattedNumber } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Car as CarIcon } from 'lucide-react';

// Define a simplified interface for the car data we fetch
interface SimpleCar {
  id: string;
  brand: string;
  category?: string;
  model: string;
  price: number;
}

interface Vehicle {
  acceleration: string | null;
  id: string;
  brand: string;
  category?: string;
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

interface LoanResult {
  bank: string;
  bankId: string;
  rate: number;
  loanAmount: number;
  totalInterest: number;
  totalPayment: number;
  monthlyPayment: number;
  approvalChance: 'High' | 'Medium' | 'Low';
  suggestion: string;
  years: number;
}

const Calculator = () => {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const { t } = useLanguage();
  
  // Load saved calculator state from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('calculatorState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load calculator state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();
  
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState(carId || savedState?.selectedCarId || '');
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);
  const [downPayment, setDownPayment] = useState(savedState?.downPayment || '');
  const [tenure, setTenure] = useState(savedState?.tenure || '5');
  const [salary, setSalary] = useState(savedState?.salary || '');
  const [results, setResults] = useState<LoanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(savedState?.categoryFilter || 'All');
  const { toast } = useToast();

  // Update selectedCarId when carId from URL changes
  useEffect(() => {
    if (carId) {
      setSelectedCarId(carId);
    }
  }, [carId]);

  useEffect(() => {
    Promise.all([fetchCars(), fetchBanks()]);
  }, []);

  useEffect(() => {
    if (selectedCarId) {
      const car = cars.find(c => c.id === selectedCarId);
      setSelectedCar(car || null);
      // Update category filter to match selected car's category
      if (car && car.category) {
        setCategoryFilter(car.category);
      }
    }
  }, [selectedCarId, cars]);

  useEffect(() => {
    // Recalculate when tenure changes and we have all required data
    if (selectedCar && downPayment && salary) {
      calculateLoan();
    }
  }, [tenure]);

  // Save calculator state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      selectedCarId,
      downPayment,
      tenure,
      salary,
      categoryFilter
    };
    localStorage.setItem('calculatorState', JSON.stringify(stateToSave));
  }, [selectedCarId, downPayment, tenure, salary, categoryFilter]);

  // Auto-calculate when returning to page with saved state
  useEffect(() => {
    if (savedState && selectedCar && savedState.downPayment && savedState.salary) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        calculateLoan();
      }, 100);
    }
  }, [selectedCar]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('id, brand, category, model, model_name, price, image_url, year')
        .order('brand');

      if (error) throw error;
      // Map the simple car data to the full Car interface
      const mappedCars = (data || []).map(car => ({
        ...car,
        acceleration: null,
        disclaimer_text: null,
        engine: null,
        financing_text: null,
        fuel_consumption: null,
        horsepower: null,
        image_url: car.image_url ?? null,
        model_name: car.model_name ?? null,
        safety_features: null,
        top_speed: null,
        year: car.year ?? new Date().getFullYear()
      } as Vehicle));
      
      setCars(mappedCars);
      
      // Ensure no car is automatically selected unless specified in URL
      if (!carId) {
        setSelectedCarId('');
        setSelectedCar(null);
      }
    } catch (error: any) {
      toast({
        title: t('calculator.carNotSelected'),
        description: t('calculator.selectCarFirst'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('id, name, interest_rate')
        .order('name');

      if (error) throw error;
      setBanks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: t('calculator.missingInfo'),
        variant: 'destructive',
      });
    }
  };

  const calculateLoan = () => {
    if (!selectedCarId) {
      toast({
        title: t('calculator.carNotSelected'),
        description: t('calculator.selectCarFirst'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedCar || !downPayment || !salary) {
      toast({
        title: t('calculator.missingInfo'),
        description: t('calculator.fillFields'),
        variant: 'destructive',
      });
      return;
    }

    const carPrice = selectedCar.price;
    const down = parseFormattedNumber(downPayment);
    const monthlySalary = parseFormattedNumber(salary);

    if (down >= carPrice) {
      toast({
        title: t('calculator.invalidDown'),
        description: t('calculator.downLess'),
        variant: 'destructive',
      });
      return;
    }

    // Calculate recommended down payment if current payment exceeds limit
    const maxAffordable = monthlySalary * 0.30;
    const years = parseInt(tenure);
    const loanResults: LoanResult[] = banks.map(bank => {
      const loanAmount = carPrice - down;
      const totalInterest = loanAmount * (bank.interest_rate / 100) * years;
      const totalPayment = loanAmount + totalInterest;
      const monthlyPayment = totalPayment / (years * 12);

      let approvalChance: 'High' | 'Medium' | 'Low';
      let suggestion: string;
      let recommendedDownPayment: number | null = null;

      if (monthlyPayment <= monthlySalary * 0.20) {
        approvalChance = 'High';
        suggestion = t('calculator.excellent');
      } else if (monthlyPayment <= monthlySalary * 0.30) {
        approvalChance = 'Medium';
        suggestion = t('calculator.affordable');
      } else {
        approvalChance = 'Low';
        // Calculate recommended down payment to bring monthly payment within limit
        const totalLoanAmountForAffordablePayment = maxAffordable * years * 12;
        recommendedDownPayment = carPrice - totalLoanAmountForAffordablePayment;
        // Ensure recommended down payment doesn't exceed car price
        recommendedDownPayment = Math.min(recommendedDownPayment, carPrice);
        // Ensure recommended down payment is higher than current down payment
        recommendedDownPayment = Math.max(recommendedDownPayment, down);
        
        // Calculate recommended minimum salary needed
        const recommendedSalary = (monthlyPayment / 0.30);
        const downPaymentDifference = recommendedDownPayment - down;
        
        // Build suggestion message
        let suggestionParts = [];
        
        if (downPaymentDifference > 0) {
          suggestionParts.push(`Consider increasing down payment by RM${formatNumber(downPaymentDifference)}`);
        }
        
        suggestionParts.push(`Have a minimum monthly salary of RM${formatNumber(recommendedSalary)}`);
        
        suggestion = `Monthly payment exceeds recommended limit. ${suggestionParts.join(' OR ')}.`;
      }

      return {
        bank: bank.name,
        bankId: bank.id,
        rate: bank.interest_rate,
        loanAmount,
        totalInterest,
        totalPayment,
        monthlyPayment,
        approvalChance,
        suggestion,
        years: years
      };
    });

    setResults(loanResults);
  };

  const getApprovalIcon = (chance: string) => {
    if (chance === 'High') return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (chance === 'Medium') return <TrendingUp className="h-5 w-5 text-warning" />;
    return <AlertCircle className="h-5 w-5 text-destructive" />;
  };

  const getApprovalColor = (chance: string) => {
    if (chance === 'High') return 'text-success';
    if (chance === 'Medium') return 'text-warning';
    return 'text-destructive';
  };

  const getApprovalCardClass = (chance: string) => {
    if (chance === 'High') return 'border-success bg-success/5';
    if (chance === 'Medium') return 'border-warning bg-warning/5';
    return 'border-destructive bg-destructive/5 opacity-80';
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

  const isCarSelectionDisabled = categoryFilter !== 'All' && cars.filter(car => car.category === categoryFilter).length === 0;

  // Format input values with commas as the user types
  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setDownPayment(value);
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d+$/.test(value)) {
      setSalary(value);
    }
  };

  // Format display values for input fields
  const formatInputDisplay = (value: string): string => {
    if (!value) return '';
    return parseInt(value).toLocaleString('en-US');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('calculator.title')}</h1>
          <p className="text-muted-foreground">{t('calculator.description', { count: banks.length })}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t('calculator.title')}</CardTitle>
              <CardDescription>{t('calculator.description', { count: banks.length })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Category Filter Dropdown */}
              <div className="space-y-2">
                <Label>{t('calculator.category')}</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('calculator.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">{t('common.all')}</SelectItem>
                    <SelectItem value="Car">{t('common.car')}</SelectItem>
                    <SelectItem value="Motorcycle">{t('common.motorcycle')}</SelectItem>
                    <SelectItem value="Van">{t('common.van')}</SelectItem>
                    <SelectItem value="Truck">{t('common.truck')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('calculator.selectVehicle')}</Label>
                <Select 
                  value={selectedCarId} 
                  onValueChange={setSelectedCarId}
                  disabled={isCarSelectionDisabled}
                >
                  <SelectTrigger className={isCarSelectionDisabled ? "opacity-50" : ""}>
                    <SelectValue placeholder={t('calculator.chooseVehicle')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoryFilter === 'All' 
                      ? cars 
                      : cars.filter(car => car.category === categoryFilter)
                    ).map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.brand} {car.model} - RM{car.price.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCarSelectionDisabled && (
                  <p className="text-sm text-muted-foreground">{t('calculator.noCars')}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="downPayment">{t('calculator.downPayment')}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('calculator.downPaymentTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="downPayment"
                  type="text"
                  inputMode="numeric"
                  placeholder={t('calculator.downPaymentPlaceholder')}
                  value={formatInputDisplay(downPayment)}
                  onChange={handleDownPaymentChange}
                  disabled={isCarSelectionDisabled || !selectedCarId}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tenure">{t('calculator.tenure')}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('calculator.tenureTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={tenure} onValueChange={setTenure} disabled={isCarSelectionDisabled || !selectedCarId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 7, 9].map((year) => (
                      <SelectItem 
                        key={year} 
                        value={year.toString()}
                        className={tenure === year.toString() ? 'bg-emerald-500 text-white' : ''}
                      >
                        {year} {year === 1 ? t('calculator.year') : t('calculator.years')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="salary">{t('calculator.salary')}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('calculator.salaryTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="salary"
                  type="text"
                  inputMode="numeric"
                  placeholder={t('calculator.salaryPlaceholder')}
                  value={formatInputDisplay(salary)}
                  onChange={handleSalaryChange}
                  disabled={isCarSelectionDisabled || !selectedCarId}
                />
              </div>

              <Button 
                onClick={calculateLoan} 
                className="w-full"
                disabled={isCarSelectionDisabled || !selectedCarId}
              >
                {isCarSelectionDisabled ? t('calculator.noCars') : selectedCarId ? t('calculator.calculate') : t('calculator.selectFirst')}
              </Button>

              {salary && !isCarSelectionDisabled && selectedCarId && (
                <Card className="bg-muted">
                  <CardContent className="pt-4 select-none">
                    <p className="text-sm text-muted-foreground mb-1">{t('calculator.maxPayment')}</p>
                    <p className="text-xl font-bold">
                      RM{formatNumber(parseFormattedNumber(salary) * 0.30)}/month
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('calculator.ofSalary')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {results.length > 0 ? (
              <>
                {selectedCar && (
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="w-full lg:w-2/3">
                          <AspectRatio ratio={16 / 9}>
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-muted">
                              {selectedCar.image_url ? (
                                <img 
                                  src={selectedCar.image_url} 
                                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                                  <CarIcon className="w-16 h-16" />
                                  <p>No photo available</p>
                                </div>
                              )}
                            </div>
                          </AspectRatio>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <h2 className="text-3xl font-bold mt-2">{selectedCar.brand} {selectedCar.model}</h2>
                          <p className="text-2xl text-primary font-semibold mt-1">RM{selectedCar.price.toLocaleString()}</p>
                          <p className="text-muted-foreground mt-2">Year {selectedCar.year}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>{t('calculator.loanComparison')}</CardTitle>
                    <CardDescription>
                      {selectedCar && `${selectedCar.brand} ${selectedCar.model}`}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Display results for the selected tenure */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {t('calculator.options', { 
                      years: tenure, 
                      yearText: parseInt(tenure) === 1 ? t('calculator.year') : t('calculator.years') 
                    })}
                  </h3>
                  {results.map((result, index) => (
                    <Card key={index} className={`mb-4 border-2 hover:shadow-lg transition-shadow ${getApprovalCardClass(result.approvalChance)}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="dark:text-white">{result.bank}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getApprovalIcon(result.approvalChance)}
                            <span className={`font-semibold ${getApprovalColor(result.approvalChance)} dark:text-white`}>
                              {result.approvalChance === 'High' ? t('calculator.highApproval') : 
                               result.approvalChance === 'Medium' ? t('calculator.mediumApproval') : 
                               t('calculator.lowApproval')}
                            </span>
                          </div>
                        </div>
                        <CardDescription className="font-bold dark:text-white/90">
                          {t('calculator.interestRate', { rate: result.rate })}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground dark:text-white/70 mt-1 font-normal">
                          {t('calculator.ratesChange')}
                        </p>
                      </CardHeader>
                      <CardContent className="select-none">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground dark:text-white/70">{t('calculator.loanAmount')}</p>
                            <p className="text-lg font-bold dark:text-white">RM{formatNumber(result.loanAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground dark:text-white/70">{t('calculator.totalInterest')}</p>
                            <p className="text-lg font-bold dark:text-white">RM{formatNumber(result.totalInterest)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground dark:text-white/70">{t('calculator.totalPayment')}</p>
                            <p className="text-lg font-bold dark:text-white">RM{formatNumber(result.totalPayment)}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-sm text-muted-foreground dark:text-white/70">{t('calculator.monthlyPayment')}</p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground dark:text-white/70" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('calculator.monthlyPaymentTooltip')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-xl font-bold text-primary dark:text-white">
                              RM{formatNumber(result.monthlyPayment)}/month
                            </p>
                          </div>
                        </div>
                        
                        {/* Max Payment Recommendation with Tooltip */}
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground dark:text-white/70">
                              {t('calculator.maxPayment')}
                            </p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground dark:text-white/70" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('calculator.maxPaymentTooltip')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-lg font-bold dark:text-white">
                            RM{formatNumber(parseFormattedNumber(salary) * 0.30)}/month
                          </p>
                        </div>
                        
                        <Card className={result.approvalChance === 'Low' ? 'border-destructive/30' : ''}>
                          <CardContent className="pt-4">
                            <p className="text-sm dark:text-white/90">{result.suggestion}</p>
                          </CardContent>
                        </Card>

                        {/* Add CTA button for bank */}
                        <div className="mt-4">
                          <Button 
                            variant={result.approvalChance === 'Low' ? 'outline' : 'default'}
                            className={`w-full ${result.approvalChance === 'Low' ? 'border-destructive text-destructive' : ''}`}
                            asChild
                          >
                            <Link to={`/banks/${result.bankId}`}>
                              {t('calculator.applyWithBank', { bank: result.bank })}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* First Box: Car Picture */}
                {selectedCar && (
                  <Card className="text-center">
                    <CardContent className="py-6">
                      <div className="flex justify-center mb-4">
                        <div className="w-full max-w-3xl mx-auto">
                          <AspectRatio ratio={16 / 9}>
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-dashed border-border bg-muted flex items-center justify-center">
                              {selectedCar.image_url ? (
                                <img 
                                  src={selectedCar.image_url} 
                                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-500 flex flex-col items-center gap-2">
                                  <CarIcon className="w-16 h-16" />
                                  <p>No photo yet</p>
                                </div>
                              )}
                            </div>
                          </AspectRatio>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Second Box: Car Name and Price */}
                {selectedCar && (
                  <Card className="text-center">
                    <CardContent className="py-6">
                      <h3 className="text-2xl font-bold mb-2">
                        {selectedCar.brand} {selectedCar.model}
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        RM{selectedCar.price.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Third Box: Instruction */}
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">
                      {t('calculator.enterDetails')}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;