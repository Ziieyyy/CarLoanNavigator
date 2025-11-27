import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ms'; // en for English, ms for Malay

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navbar
    'navbar.cars': 'Cars',
    'navbar.calculator': 'Calculator',
    'navbar.admin': 'Admin',
    'navbar.profile': 'Profile',
    'navbar.login': 'Login',
    'navbar.logout': 'Logout',
    
    // Index Page
    'index.title': 'Compare Car Loans Instantly',
    'index.description': 'Find the best car loan rates from 3 major banks and discover if you can afford your dream car based on your salary',
    'index.getStarted': 'Get Started',
    'index.goToDashboard': 'Go to Dashboard',
    'index.browseCars': 'Browse Cars',
    'index.startComparing': 'Start Comparing Now',
    'index.smartCalculator': 'Smart Calculator',
    'index.calculatorDesc': 'Compare rates from Bank A (2.5%), Bank B (2.7%), and Bank C (3.0%) instantly',
    'index.affordabilityCheck': 'Affordability Check',
    'index.affordabilityDesc': 'See your approval chances based on your monthly salary and get personalized recommendations',
    'index.secureSimple': 'Secure & Simple',
    'index.secureDesc': 'Create your account in seconds and start making informed decisions about your car purchase',
    'index.dataSecurity': 'Your salary and personal data are kept private and are not shared without your consent.',
    'index.ready': 'Ready to Find Your Perfect Car Loan?',
    'index.join': 'Join thousands of users who made smart financing decisions',
    'index.viewCars': 'View All Cars',
    'index.createAccount': 'Create Free Account',
    
    // Calculator Page
    'calculator.title': 'Loan Calculator',
    'calculator.description': 'Compare loan options from {count} banks based on your salary',
    'calculator.category': 'Category',
    'calculator.selectVehicle': 'Select Vehicle',
    'calculator.chooseVehicle': 'Choose a vehicle',
    'calculator.downPayment': 'Down Payment (RM)',
    'calculator.downPaymentPlaceholder': 'e.g., 25,000',
    'calculator.downPaymentTooltip': 'The initial amount you pay upfront when purchasing a car',
    'calculator.tenure': 'Loan Tenure (Years)',
    'calculator.tenureTooltip': 'The duration over which you will repay the loan',
    'calculator.salary': 'Monthly Salary (RM)',
    'calculator.salaryPlaceholder': 'e.g., 5,000',
    'calculator.salaryTooltip': 'Your gross monthly income before taxes and deductions',
    'calculator.calculate': 'Calculate',
    'calculator.noCars': 'No Cars Available',
    'calculator.selectFirst': 'Select a Car First',
    'calculator.maxPayment': 'Recommended Max Payment',
    'calculator.ofSalary': '(30% of your salary)',
    'calculator.selected': 'Selected Car',
    'calculator.loanComparison': 'Loan Comparison',
    'calculator.options': '{years} {yearText} Loan Options',
    'calculator.year': 'Year',
    'calculator.years': 'Years',
    'calculator.interestRate': 'Interest Rate: {rate}%',
    'calculator.ratesChange': '(Rates will change according to the current year)',
    'calculator.loanAmount': 'Loan Amount',
    'calculator.totalInterest': 'Total Interest',
    'calculator.totalPayment': 'Total Payment',
    'calculator.monthlyPayment': 'Monthly Payment',
    'calculator.monthlyPaymentTooltip': 'This is your fixed monthly payment for the selected loan tenure',
    'calculator.highApproval': 'High Approval Chance',
    'calculator.mediumApproval': 'Medium Approval Chance',
    'calculator.lowApproval': 'Low Approval Chance',
    'calculator.excellent': 'Excellent! This loan is well within your budget.',
    'calculator.affordable': 'Affordable, but consider your other expenses.',
    'calculator.exceeds': 'Monthly payment exceeds recommended limit. Consider increasing down payment by RM{amount}.',
    'calculator.maxPaymentTooltip': 'This limit is based on your stated salary and bank debt-to-income (DTI) ratio guidelines.',
    'calculator.seeRecommendedDownPayment': 'See Loan with Recommended Down Payment',
    'calculator.applyWithBank': 'Apply with {bank}',
    'calculator.contactRepresentative': 'Contact {bank} Representative',
    'calculator.enterDetails': 'Enter your details and click Calculate to see loan comparisons',
    'calculator.carNotSelected': 'Car Not Selected',
    'calculator.selectCarFirst': 'Please select a car before calculating the loan',
    'calculator.missingInfo': 'Missing Information',
    'calculator.fillFields': 'Please fill in all fields',
    'calculator.invalidDown': 'Invalid Down Payment',
    'calculator.downLess': 'Down payment must be less than car price',
    
    // Auth Page
    'auth.welcomeBack': 'Welcome Back',
    'auth.createAccount': 'Create Account',
    'auth.loginDesc': 'Login to compare car loans',
    'auth.registerDesc': 'Register to start comparing car loans',
    'auth.fullName': 'Full Name',
    'auth.namePlaceholder': 'John Doe',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': '••••••••',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': '••••••••',
    'auth.pleaseWait': 'Please wait...',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.noAccount': "Don't have an account? Register",
    'auth.hasAccount': 'Already have an account? Login',
    
    // Cars Page
    'cars.available': 'Available Cars',
    'cars.browse': 'Browse our collection and calculate your loan options',
    'cars.noAvailable': 'No cars available yet',
    'cars.year': 'Year',
    'cars.viewDetails': 'View Details',
    'cars.calculateLoan': 'Calculate Loan',
    'cars.loadError': 'Failed to load cars',
    
    // Car Detail Page
    'carDetail.notFound': 'Car not found',
    'carDetail.loadError': 'Failed to load car details',
    'carDetail.backToCars': 'Back to Cars',
    'carDetail.engine': 'Engine',
    'carDetail.horsepower': 'Horsepower',
    'carDetail.topSpeed': 'Top Speed',
    'carDetail.fuelEconomy': 'Fuel Economy',
    'carDetail.year': 'Year',
    'carDetail.category': 'Category',
    'carDetail.price': 'Price',
    'carDetail.financingAvailable': 'Financing Available',
    'carDetail.financingDefault': 'Compare loan options from 3 different banks and find out if you can afford this vehicle based on your salary.',
    'carDetail.calculateLoan': 'Calculate Loan Options',
    'carDetail.notSpecified': 'Not specified',
    
    // Profile Page
    'profile.title': 'My Profile',
    'profile.infoTitle': 'Profile Information',
    'profile.infoDesc': 'Update your personal details',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.saving': 'Saving...',
    'profile.saveChanges': 'Save Changes',
    'profile.loadError': 'Failed to load profile',
    'profile.updateSuccess': 'Profile updated successfully',
    
    // NotFound Page
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home',
    
    // Common
    'common.all': 'All',
    'common.car': 'Car',
    'common.van': 'Van',
    'common.truck': 'Truck',
  },
  ms: {
    // Navbar
    'navbar.cars': 'Kereta',
    'navbar.calculator': 'Kalkulator',
    'navbar.admin': 'Admin',
    'navbar.profile': 'Profil',
    'navbar.login': 'Log Masuk',
    'navbar.logout': 'Log Keluar',
    
    // Index Page
    'index.title': 'Bandingkan Pinjaman Kereta Dengan Segera',
    'index.description': 'Cari kadar pinjaman kereta terbaik daripada 3 bank utama dan ketahui sama ada anda mampu membeli kereta impian berdasarkan gaji bulanan anda',
    'index.getStarted': 'Mulakan Sekarang',
    'index.goToDashboard': 'Pergi ke Papan Pemuka',
    'index.browseCars': 'Semak Semua Kereta',
    'index.startComparing': 'Mula Bandingkan Sekarang',
    'index.smartCalculator': 'Kalkulator Pintar',
    'index.calculatorDesc': 'Bandingkan kadar daripada Bank A (2.5%), Bank B (2.7%), dan Bank C (3.0%) dengan segera',
    'index.affordabilityCheck': 'Semakan Kemampuan',
    'index.affordabilityDesc': 'Lihat peluang kelulusan berdasarkan gaji bulanan anda dan dapatkan cadangan yang dipersonalisasi',
    'index.secureSimple': 'Selamat & Mudah',
    'index.secureDesc': 'Cipta akaun dalam beberapa saat dan mula membuat keputusan kewangan yang bijak untuk pembelian kereta anda',
    'index.dataSecurity': 'Gaji dan data peribadi anda disimpan secara peribadi dan tidak dikongsi tanpa persetujuan anda.',
    'index.ready': 'Sedia untuk Menemui Pinjaman Kereta yang Sesuai?',
    'index.join': 'Sertai ribuan pengguna yang membuat keputusan pembiayaan yang bijak',
    'index.viewCars': 'Lihat Semua Kereta',
    'index.createAccount': 'Cipta Akaun Percuma',
    
    // Calculator Page
    'calculator.title': 'Kalkulator Pinjaman',
    'calculator.description': 'Bandingkan pilihan pinjaman daripada {count} bank berdasarkan gaji anda',
    'calculator.category': 'Kategori',
    'calculator.selectVehicle': 'Pilih Kenderaan',
    'calculator.chooseVehicle': 'Pilih kenderaan',
    'calculator.downPayment': 'Bayaran Pendahuluan (RM)',
    'calculator.downPaymentPlaceholder': 'e.g., 25,000',
    'calculator.downPaymentTooltip': 'Jumlah awal yang anda bayar apabila membeli kenderaan',
    'calculator.tenure': 'Tempoh Pinjaman (Tahun)',
    'calculator.tenureTooltip': 'Tempoh yang anda perlu membayar balik pinjaman',
    'calculator.salary': 'Gaji Bulanan (RM)',
    'calculator.salaryPlaceholder': 'e.g., 5,000',
    'calculator.salaryTooltip': 'Gaji bulanan anda sebelum cukai dan potongan',
    'calculator.calculate': 'Kira',
    'calculator.noCars': 'Tiada Kereta Tersedia',
    'calculator.selectFirst': 'Pilih Kereta Dahulu',
    'calculator.maxPayment': 'Bayaran Maksimum yang Disyorkan',
    'calculator.ofSalary': '(30% daripada gaji anda)',
    'calculator.selected': 'Kereta Dipilih',
    'calculator.loanComparison': 'Perbandingan Pinjaman',
    'calculator.options': 'Pilihan Pinjaman {years} {yearText}',
    'calculator.year': 'Tahun',
    'calculator.years': 'Tahun',
    'calculator.interestRate': 'Kadar Faedah: {rate}%',
    'calculator.ratesChange': '(Kadar akan berubah mengikut tahun semasa)',
    'calculator.loanAmount': 'Jumlah Pinjaman',
    'calculator.totalInterest': 'Jumlah Faedah',
    'calculator.totalPayment': 'Jumlah Bayaran',
    'calculator.monthlyPayment': 'Bayaran Bulanan',
    'calculator.monthlyPaymentTooltip': 'Ini adalah bayaran bulanan tetap anda untuk tempoh pinjaman yang dipilih',
    'calculator.highApproval': 'Peluang Kelulusan Tinggi',
    'calculator.mediumApproval': 'Peluang Kelulusan Sederhana',
    'calculator.lowApproval': 'Peluang Kelulusan Rendah',
    'calculator.excellent': 'Hebat! Pinjaman ini masih selesa dalam bajet anda.',
    'calculator.affordable': 'Mampu, tetapi pertimbangkan perbelanjaan lain anda.',
    'calculator.exceeds': 'Bayaran bulanan melebihi had yang disyorkan. Pertimbangkan meningkatkan bayaran pendahuluan sebanyak RM{amount}.',
    'calculator.maxPaymentTooltip': 'Had ini berdasarkan gaji yang anda nyatakan dan panduan nisbah hutang terhadap pendapatan (DTI) bank.',
    'calculator.seeRecommendedDownPayment': 'Lihat Pinjaman dengan Bayaran Pendahuluan yang Disyorkan',
    'calculator.applyWithBank': 'Buat Aplikasi dengan {bank}',
    'calculator.contactRepresentative': 'Hubungi Penyelia {bank}',
    'calculator.enterDetails': 'Masukkan maklumat anda dan klik Kira untuk melihat perbandingan pinjaman',
    'calculator.carNotSelected': 'Kereta Tidak Dipilih',
    'calculator.selectCarFirst': 'Sila pilih kereta sebelum mengira pinjaman',
    'calculator.missingInfo': 'Maklumat Tidak Lengkap',
    'calculator.fillFields': 'Sila isi semua medan',
    'calculator.invalidDown': 'Bayaran Pendahuluan Tidak Sah',
    'calculator.downLess': 'Bayaran pendahuluan mestilah kurang daripada harga kereta',
    
    // Auth Page
    'auth.welcomeBack': 'Selamat Kembali',
    'auth.createAccount': 'Cipta Akaun',
    'auth.loginDesc': 'Log masuk untuk membandingkan pinjaman kereta',
    'auth.registerDesc': 'Daftar untuk mula membandingkan pinjaman kereta',
    'auth.fullName': 'Nama Penuh',
    'auth.namePlaceholder': 'Ali bin Abu',
    'auth.email': 'Emel',
    'auth.emailPlaceholder': 'anda@contoh.com',
    'auth.password': 'Kata Laluan',
    'auth.passwordPlaceholder': '••••••••',
    'auth.confirmPassword': 'Sahkan Kata Laluan',
    'auth.confirmPasswordPlaceholder': '••••••••',
    'auth.pleaseWait': 'Sila tunggu...',
    'auth.login': 'Log Masuk',
    'auth.register': 'Daftar',
    'auth.noAccount': 'Tiada akaun? Daftar',
    'auth.hasAccount': 'Sudah ada akaun? Log masuk',
    
    // Cars Page
    'cars.available': 'Kereta yang Ada',
    'cars.browse': 'Semak koleksi kami dan kira pilihan pinjaman anda',
    'cars.noAvailable': 'Tiada kereta tersedia lagi',
    'cars.year': 'Tahun',
    'cars.viewDetails': 'Lihat Butiran',
    'cars.calculateLoan': 'Kira Pinjaman',
    'cars.loadError': 'Gagal memuatkan kereta',
    
    // Car Detail Page
    'carDetail.notFound': 'Kereta tidak dijumpai',
    'carDetail.loadError': 'Gagal memuatkan butiran kereta',
    'carDetail.backToCars': 'Kembali ke Senarai Kereta',
    'carDetail.engine': 'Enjin',
    'carDetail.horsepower': 'Kuasa Kuda',
    'carDetail.topSpeed': 'Kelajuan Tertinggi',
    'carDetail.fuelEconomy': 'Penggunaan Bahan Api',
    'carDetail.year': 'Tahun',
    'carDetail.category': 'Kategori',
    'carDetail.price': 'Harga',
    'carDetail.financingAvailable': 'Pembiayaan Tersedia',
    'carDetail.financingDefault': 'Bandingkan pilihan pinjaman daripada 3 bank berbeza dan ketahui sama ada anda mampu membeli kenderaan ini berdasarkan gaji anda.',
    'carDetail.calculateLoan': 'Kira Pilihan Pinjaman',
    'carDetail.notSpecified': 'Tidak dinyatakan',
    
    // Profile Page
    'profile.title': 'Profil Saya',
    'profile.infoTitle': 'Maklumat Profil',
    'profile.infoDesc': 'Kemaskini maklumat peribadi anda',
    'profile.fullName': 'Nama Penuh',
    'profile.email': 'Emel',
    'profile.saving': 'Menyimpan...',
    'profile.saveChanges': 'Simpan Perubahan',
    'profile.loadError': 'Gagal memuatkan profil',
    'profile.updateSuccess': 'Profil berjaya dikemaskini',
    
    // NotFound Page
    'notFound.message': 'Oops! Halaman tidak dijumpai',
    'notFound.returnHome': 'Kembali ke Laman Utama',
    
    // Common
    'common.all': 'Semua',
    'common.car': 'Kereta',
    'common.van': 'Van',
    'common.truck': 'Trak',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, variables?: Record<string, string | number>): string => {
    let translation = translations[language][key] || key;
    
    if (variables) {
      Object.keys(variables).forEach(variable => {
        translation = translation.replace(`{${variable}}`, String(variables[variable]));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};