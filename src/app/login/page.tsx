'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative backdrop */}
        <div className="absolute -top-4 -left-4 w-full h-full bg-blue-500/20 rounded-2xl blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-full h-full bg-purple-500/20 rounded-2xl blur-xl"></div>

        <form action={dispatch} className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sendy Track
            </h1>
            <p className="text-slate-400 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 ml-1 mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 ml-1 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <LoginButton />
          
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <Activity className="h-5 w-5 text-red-400" />
                <p className="text-sm text-red-400">{errorMessage}</p>
              </>
            )}
          </div>
        </form>
      </div>
      
      <p className="mt-8 text-center text-xs text-slate-500">
        &copy; 2026 Sendy Track. Secure System.
      </p>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
      aria-disabled={pending}
    >
      {pending ? 'Logging in...' : 'Sign In'} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
