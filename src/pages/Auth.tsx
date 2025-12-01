import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Car, Eye, EyeOff, Lock, Mail, Languages, ArrowLeft } from 'lucide-react';
import { z } from 'zod';



const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});



const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { signIn, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validated = loginSchema.parse({ email, password });
      const { error } = await signIn(validated.email, validated.password);
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
      } else {
        // Trigger fade out animation immediately
        setFadeOut(true);
        
        // Show success toast
        toast({
          title: 'Success',
          description: 'Admin logged in successfully!',
        });
        
        // Navigate after smooth fade out
        setTimeout(() => {
          navigate('/admin', { replace: true });
        }, 400);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
      setLoading(false);
    }
  };



  return (
    <div className={`h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Left Background Panel - Only show on desktop */}
      <div className="hidden lg:flex lg:w-[30%] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #A50021 0%, #D12336 100%)' }}>
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-8 py-6 text-white dark:text-white">
          <div className="animate-in fade-in zoom-in duration-1000">
            <Car className="h-16 w-16 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          
          <h1 className="text-4xl font-bold mb-3 text-center animate-in slide-in-from-left duration-700 delay-200">
            Admin Portal
          </h1>
          
          <p className="text-lg text-center max-w-md mb-6 animate-in slide-in-from-left duration-700 delay-400" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Manage vehicles, banks, and platform settings
          </p>
          
          <div className="space-y-3 w-full max-w-md animate-in slide-in-from-left duration-700 delay-600">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Secure Access</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Admin-only authentication</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Full Control</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Manage all platform content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Real-time Updates</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Instant changes to platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Content Panel */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
            {/* Admin Login Card */}
            <Card className="w-full shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white dark:bg-gray-800" style={{ borderRadius: '16px' }}>
          <CardHeader className="text-center pb-3">
            {/* Back to Home Button */}
            <Link to="/" className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#A50021] dark:hover:text-[#D12336] transition-all duration-200 hover:gap-3 hover:scale-105">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="flex justify-center mb-3 animate-in zoom-in duration-500 delay-100">
              <div className="bg-[#A50021] p-2.5 rounded-full transition-transform hover:scale-110 hover:rotate-12 duration-300">
                <Car className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-xs hover:bg-primary/10 transition-colors"
                style={{ color: '#A50021' }}
              >
                <Languages className="h-4 w-4 mr-1" />
                {language === 'en' ? 'Bahasa Malaysia' : 'English'}
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold animate-in fade-in slide-in-from-top-2 duration-500 delay-200 text-gray-900 dark:text-white">
              Admin Login
            </CardTitle>
            <CardDescription className="text-sm animate-in fade-in duration-500 delay-300 text-gray-600 dark:text-gray-300">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-[#A50021] hover:border-[#D12336] transition-all duration-200 focus:shadow-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    style={{ borderRadius: '10px' }}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-2 focus:border-[#A50021] hover:border-[#D12336] transition-all duration-200 focus:shadow-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    style={{ borderRadius: '10px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-all duration-200 hover:scale-110"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                  </button>
                </div>

              </div>



              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400" 
                style={{ 
                  backgroundColor: loading ? '#D12336' : '#A50021',
                  borderRadius: '10px',
                  color: 'white'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#D12336')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A50021')}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;