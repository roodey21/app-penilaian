"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';
import session from '../../utils/session';
import { isManagerRole } from '../../constants/managerRoles';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); // DDMMYYYY raw
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const dobInputRef = useRef(null);

  useEffect(() => {
    const s = session.getSession();
    if (s && s.user) {
      const roleName = s.user?.role?.name;
      if (isManagerRole(roleName)) {
        router.push('/dashboard');
      } else {
        router.push('/assessment');
      }
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    if (step === 'dob' && dobInputRef.current) {
      dobInputRef.current.focus();
    }
  }, [step]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setStep('dob');
      setError(null);
    }
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setBirthDate(value);
    }
  };

  // Backend expects raw DDMMYYYY as date_of_birth, no conversion needed now.

  const handleDobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (birthDate.length !== 8) {
        throw new Error('Tanggal lahir harus 8 digit (DDMMYYYY)');
      }
      const endpoint = process.env.NEXT_PUBLIC_AUTH_API || 'https://dashboard.test/api/auth/confirm-email-dob';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date_of_birth: birthDate }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Verification failed');
      }
      if (!data.matched) {
        throw new Error('Email atau tanggal lahir tidak cocok');
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      let userObj = data.user;
      // If role info not present, fetch it from /auth/user
      if (!userObj?.role) {
        try {
          const roleRes = await fetch('/auth/user', {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (roleRes.ok) {
            const roleData = await roleRes.json();
            // assume same structure returns user+role
            if (roleData?.role) {
              userObj = { ...userObj, role: roleData.role };
            }
          }
        } catch (_) {
          // silent fail, treat as regular user
        }
      }

      session.setSession({ token: data.token, user: userObj, expiresAt });

      const roleName = userObj?.role?.name;
      if (isManagerRole(roleName)) {
        router.push('/dashboard');
      } else {
        router.push('/assessment');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="https://lpphotel.com/wp-content/uploads/2023/03/logo-lpp.png" 
            alt="LPP Logo" 
            className="object-contain w-20 h-20 mx-auto mb-4"
          />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">360° Best Employee Survey</h1>
          <p className="text-gray-500">LPP Hotel & MICE Group</p>
        </div>

        <div className="p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
          {step === 'email' ? (
            <>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="mb-2 text-xl font-bold text-center text-gray-900">Verifikasi Email</h2>
              <p className="mb-6 text-sm text-center text-gray-500">
                Masukkan email terdaftar Anda untuk memulai survey
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@lpphotel.com"
                    autoComplete='email'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="flex items-center justify-center w-full py-3 space-x-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="p-4 mt-6 border rounded-lg bg-sky-50 border-sky-200">
                <p className="text-xs text-sky-800">
                  <strong>Catatan:</strong> Email Anda harus terdaftar dalam sistem. Jika mengalami kendala, hubungi HRD.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <button 
                  onClick={() => {
                    setStep('email');
                    setError(null);
                  }}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Kembali
                </button>
              </div>

              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="mb-2 text-xl font-bold text-center text-gray-900">Verifikasi Tanggal Lahir</h2>
              <p className="mb-6 text-sm text-center text-gray-500">
                Masukkan tanggal lahir Anda untuk verifikasi
              </p>

              <form onSubmit={handleDobSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Tanggal Lahir</label>
                  <input
                    ref={dobInputRef}
                    type="password"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    placeholder="DDMMYYYY"
                    maxLength={8}
                    inputMode="numeric"
                    className="w-full px-4 py-3 text-lg tracking-widest text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-xs text-center text-gray-500">Format: DDMMYYYY (contoh: 23011990 untuk 23 Januari 1990)</p>
                </div>

                {error && (
                  <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full py-3 space-x-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Memverifikasi...' : 'Mulai Survey'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="p-4 mt-6 border rounded-lg bg-sky-50 border-sky-200">
                <p className="text-xs text-sky-800">
                  <strong>Catatan:</strong> Tanggal lahir harus sesuai dengan data di sistem HRD.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
