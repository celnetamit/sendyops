'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleSync = async () => {
    setSyncing(true);
    setStatus('idle');
    
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      
      const data = await res.json();
      setStatus('success');
      router.refresh();
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button 
      onClick={handleSync}
      disabled={syncing}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${status === 'success' ? 'bg-green-50 text-green-700' : 
          status === 'error' ? 'bg-red-50 text-red-700' : 
          'bg-blue-600 text-white hover:bg-blue-700'}
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      {syncing ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : status === 'success' ? (
        <CheckCircle className="h-4 w-4" />
      ) : status === 'error' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      <span>
        {syncing ? 'Syncing...' : 
         status === 'success' ? 'Synced!' : 
         status === 'error' ? 'Failed' : 
         'Sync Data'}
      </span>
    </button>
  );
}
