import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Car, Eye, EyeOff, Lock, Mail, User, Check, X, Languages } from 'lucide-react';
import { z } from 'zod';

// Enhanced password validation
const passwordValidation = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(12, 'Password must not exceed 12 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Must contain at least one special character')
  .refine((password) => !/([a-zA-Z0-9])\1{3,}/.test(password), 'Cannot contain repeated characters (e.g., aaaa, 1111)')
  .refine((password) => {
    const sequences = ['abcd', 'bcde', 'cdef', '1234', '2345', '3456', '4567', '5678', '6789', 'qwer', 'wert', 'erty', 'asdf', 'sdfg', 'zxcv'];
    return !sequences.some(seq => password.toLowerCase().includes(seq));
  }, 'Cannot contain sequential patterns');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  // Password requirements
  const passwordRequirements: PasswordRequirement[] = [
    { label: t('auth.req8to12'), test: (pwd) => pwd.length >= 8 && pwd.length <= 12 },
    { label: t('auth.reqUppercase'), test: (pwd) => /[A-Z]/.test(pwd) },
    { label: t('auth.reqLowercase'), test: (pwd) => /[a-z]/.test(pwd) },
    { label: t('auth.reqNumber'), test: (pwd) => /[0-9]/.test(pwd) },
    { label: t('auth.reqSpecial'), test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
    { label: t('auth.reqNoRepeat'), test: (pwd) => !/([a-zA-Z0-9])\1{3,}/.test(pwd) },
    { label: t('auth.reqNoSequence'), test: (pwd) => {
      const sequences = ['abcd', 'bcde', 'cdef', '1234', '2345', '3456', '4567', '5678', '6789', 'qwer', 'wert', 'erty'];
      return !sequences.some(seq => pwd.toLowerCase().includes(seq));
    }},
  ];

  // Calculate password strength
  const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    const metRequirements = passwordRequirements.filter(req => req.test(pwd)).length;
    const percentage = (metRequirements / passwordRequirements.length) * 100;
    
    if (percentage < 40) return { strength: percentage, label: 'Weak', color: 'bg-red-500' };
    if (percentage < 70) return { strength: percentage, label: 'Medium', color: 'bg-orange-500' };
    if (percentage < 100) return { strength: percentage, label: 'Good', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (user) {
      navigate('/cars');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const validated = loginSchema.parse({ email, password });
        const { error } = await signIn(validated.email, validated.password);
        
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Logged in successfully!',
          });
          navigate('/cars');
        }
      } else {
        const validated = registerSchema.parse({ email, password, confirmPassword, name });
        const { error } = await signUp(validated.email, validated.password, validated.name);
        
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Account created successfully!',
          });
          navigate('/cars');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
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
            {t('auth.leftPanelTitle')}
          </h1>
          
          <p className="text-lg text-center max-w-md mb-6 animate-in slide-in-from-left duration-700 delay-400" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {t('auth.leftPanelDesc')}
          </p>
          
          <div className="space-y-3 w-full max-w-md animate-in slide-in-from-left duration-700 delay-600">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('auth.compareMultipleBanks')}</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('auth.compareMultipleBanksDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('auth.securePrivate')}</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('auth.securePrivateDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('auth.instantResults')}</h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{t('auth.instantResultsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Content Panel */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className={`w-full transition-all duration-500 ${
          isLogin 
            ? 'max-w-md' 
            : 'max-w-5xl grid lg:grid-cols-2 gap-6'
        }`}>
            {/* Main Auth Card */}
            <Card className="w-full shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white dark:bg-gray-800" style={{ borderRadius: '16px' }}>
          <CardHeader className="text-center pb-3">
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
              {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
            </CardTitle>
            <CardDescription className="text-sm animate-in fade-in duration-500 delay-300 text-gray-600 dark:text-gray-300">
              {isLogin ? t('auth.loginDesc') : t('auth.registerDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.fullName')}
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('auth.namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 border-2 focus:border-[#A50021] hover:border-[#D12336] transition-all duration-200 focus:shadow-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      style={{ borderRadius: '10px' }}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('auth.email')}
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
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
                  {t('auth.password')}
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
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
                
                {/* Password Strength Meter - Only show when registering and typing */}
                {!isLogin && password && (
                  <div className="space-y-2 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: '#2C2C2C' }} className="dark:text-gray-300">{t('auth.passwordStrength')}</span>
                      <span className="font-semibold transition-colors duration-300" style={{ color: passwordStrength.strength === 100 ? '#22c55e' : passwordStrength.strength >= 70 ? '#eab308' : passwordStrength.strength >= 40 ? '#f97316' : '#ef4444' }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ease-out ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.confirmPassword')}
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-transform group-focus-within:scale-110 duration-200" style={{ color: '#A50021' }} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-2 focus:border-[#A50021] hover:border-[#D12336] transition-all duration-200 focus:shadow-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      style={{ borderRadius: '10px' }}
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-all duration-200 hover:scale-110"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Eye className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
                    </button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400" 
                style={{ 
                  backgroundColor: '#A50021',
                  borderRadius: '10px',
                  color: 'white'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D12336'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#A50021'}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('auth.pleaseWait')}
                  </div>
                ) : (
                  isLogin ? t('auth.login') : t('auth.register')
                )}
              </Button>
            </form>

            <div className="mt-4 text-center animate-in fade-in duration-500 delay-500">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium hover:underline transition-all duration-200 hover:scale-105 inline-block"
                style={{ color: '#A50021' }}
              >
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Password Requirements Card - Only show when registering */}
        {!isLogin && (
          <Card className="w-full shadow-lg animate-in fade-in slide-in-from-right-8 duration-700 delay-200 h-fit bg-white dark:bg-gray-800" style={{ borderRadius: '16px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Lock className="h-4 w-4 animate-pulse" style={{ color: '#A50021' }} />
                {t('auth.passwordRequirements')}
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                {t('auth.passwordRequirementsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {passwordRequirements.map((requirement, index) => {
                  const isMet = requirement.test(password);
                  return (
                    <li key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className={`rounded-full p-0.5 transition-all duration-300 ${
                        isMet ? 'bg-green-100 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'
                      }`}>
                        {isMet ? (
                          <Check className="h-3 w-3 text-green-600 animate-in zoom-in duration-300" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                      <span 
                        className={`text-xs transition-all duration-300 leading-tight ${
                          isMet ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {requirement.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
              
              <div className="mt-3 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-xs font-semibold mb-1 text-red-900 dark:text-red-300">{t('auth.avoidTitle')}</p>
                <ul className="text-xs space-y-0.5 leading-tight text-red-800 dark:text-red-400">
                  <li className="animate-in fade-in duration-300 delay-100">{t('auth.avoidCommon')}</li>
                  <li className="animate-in fade-in duration-300 delay-200">{t('auth.avoidPersonal')}</li>
                  <li className="animate-in fade-in duration-300 delay-300">{t('auth.avoidKeyboard')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default Auth;