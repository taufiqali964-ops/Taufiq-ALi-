import React, { useState } from 'react';
import { Lock, Phone, KeyRound, ShieldCheck, Sparkles, ArrowRight, Eye, EyeOff, Languages, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser, Language } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  language,
  onLanguageChange,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isUrdu = language === 'ur';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanMobile = mobileNumber.trim();
    const cleanPassword = password.trim();

    if (!cleanMobile) {
      setError(isUrdu ? 'براہ کرم اپنا موبائل نمبر درج کریں۔' : 'Please enter your mobile phone number.');
      return;
    }

    // Required passcode check: 7424
    if (cleanPassword !== '7424') {
      setError(
        isUrdu
          ? 'درج کیا گیا پاس ورڈ درست نہیں ہے۔ درست رسائی کوڈ 7424 ہے۔'
          : 'Invalid passcode. The authorized access password is 7424.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user: AuthUser = {
        mobileNumber: cleanMobile,
        name: 'Taufiq Ali (توفیق علی)',
        loggedInAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('taufiq_hrms_auth', JSON.stringify(user));
      } catch (err) {
        console.warn('Could not store auth in localStorage', err);
      }

      setIsLoading(false);
      onLoginSuccess(user);
    }, 400);
  };

  const handleQuickFill = () => {
    setMobileNumber('0300-7424000');
    setPassword('7424');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher Top Right */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={() => onLanguageChange(language === 'ur' ? 'en' : 'ur')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all shadow-sm"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{language === 'ur' ? 'English' : 'اردو'}</span>
        </button>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-7 sm:p-9 text-slate-800">
          {/* Logo & Portal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 mb-4 ring-4 ring-indigo-50">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] mb-2 border border-indigo-100">
              {isUrdu ? 'مستند سکریننگ پورٹل' : 'Authorized HRMS Portal'}
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              توفیق علی ایچ آر ایم ایس اے ٹی ایس سکریننگ
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Taufiq Ali HRMS ATS Screening System
            </p>
          </div>

          {/* Quick Access Helper Badge */}
          <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-medium">
              <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {isUrdu ? 'لاگ ان پاس ورڈ:' : 'Passcode:'}{' '}
                <strong className="font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-200 text-indigo-700 font-bold">
                  7424
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-100/70 px-2.5 py-1 rounded-lg border border-indigo-200/80 transition-colors shadow-2xs"
            >
              {isUrdu ? 'خودکار فل' : 'Quick Fill'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mobile Number Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{isUrdu ? 'موبائل نمبر (Mobile Number)' : 'Mobile Number'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isUrdu ? 'مثال: 03001234567' : 'e.g. 03001234567'}
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="0300-1234567 / +92 300..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{isUrdu ? 'پاس ورڈ (Password / Passcode)' : 'Password / Passcode'}</span>
                <span className="text-[10px] font-semibold text-indigo-600">7424</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter passcode 7424"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isUrdu ? 'لاگ ان ہو رہا ہے...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{isUrdu ? 'محفوظ لاگ ان کریں' : 'Secure Login'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isUrdu
                  ? 'محفوظ اے ٹی ایس کنکشن • توفیق علی ایچ آر ایم ایس'
                  : 'Secured Connection • Taufiq Ali HRMS ATS Platform'}
              </span>
            </p>
          </div>
        </div>

        {/* Bottom subtle copyright */}
        <p className="text-center text-white/50 text-[11px] mt-4">
          © {new Date().getFullYear()} Taufiq Ali HRMS ATS Screening. All rights reserved.
        </p>
      </div>
    </div>
  );
};
