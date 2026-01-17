'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Activity, Mail, LogIn, AlertCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'login' | 'logout' | 'mail_sent' | 'error';
  message: string;
  timestamp: string;
  details?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'login' | 'mail'>('all');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/logs?type=${filter}`);
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'login': return <LogIn className="h-5 w-5 text-blue-500" />;
      case 'logout': return <LogIn className="h-5 w-5 text-gray-500 transform rotate-180" />;
      case 'mail_sent': return <Mail className="h-5 w-5 text-green-500" />;
      default: return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-500 text-sm">View login/logout history and mail details</p>
        </div>
        
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {(['all', 'mail', 'login'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">Loading logs...</div>
        ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No logs found for this category.</p>
            </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getIcon(log.type)}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900 capitalize">
                            {log.type.replace('_', ' ')}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.timestamp), 'PPp')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
