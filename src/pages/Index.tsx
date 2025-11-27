import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Car, Calculator, TrendingUp, Shield } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <img src="/car-logo.svg" alt="Car Logo" className="h-8 w-8" />
              Car Loan Navigator
            </div>
            <Link to={user ? "/cars" : "/auth"}>
              <Button>{user ? t('index.goToDashboard') : t('index.getStarted')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('index.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('index.description')}
          </p>
          <Link to={user ? "/cars" : "/auth"}>
            <Button size="lg" className="text-lg px-8">
              {user ? t('index.browseCars') : t('index.startComparing')}
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('index.smartCalculator')}</h3>
              <p className="text-muted-foreground">
                {t('index.calculatorDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('index.affordabilityCheck')}</h3>
              <p className="text-muted-foreground">
                {t('index.affordabilityDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t('index.secureSimple')}</h3>
              <p className="text-muted-foreground">
                {t('index.secureDesc')}
              </p>
              {/* Added data security explanation */}
              <p className="text-sm text-muted-foreground mt-2 italic">
                {t('index.dataSecurity')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('index.ready')}</h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t('index.join')}
            </p>
            <Link to={user ? "/cars" : "/auth"}>
              <Button size="lg" className="text-lg px-8">
                {user ? t('index.viewCars') : t('index.createAccount')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;