'use client';

import { useState, useEffect } from 'react';

type Subscriber = {
  id: string;
  name: string;
  email: string;
  list: string;
  timestamp: number;
};

type StatusType = 'bounced' | 'complaint' | 'unsubscribed';

export default function JunkManagementPage() {
  const [activeTab, setActiveTab] = useState<StatusType>('bounced');
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData(activeTab, page);
  }, [activeTab, page]);

  const fetchData = async (status: StatusType, pageNum: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/sendy/subscribers/status?status=${status}&page=${pageNum}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();
      setData(json.data);
      setTotalPages(json.pagination.totalPages);
    } catch (err) {
      setError('Error loading data. Ensure database connection is active.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: StatusType) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page on tab change
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Blacklist & Junk Management</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {(['bounced', 'complaint', 'unsubscribed'] as StatusType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`pb-2 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadowoverflow-hidden">
        {loading && <div className="p-8 text-center text-gray-500">Loading...</div>}
        
        {error && <div className="p-8 text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">List ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No records found.</td>
                   </tr>
                ) : (
                  data.map((sub, idx) => (
                    <tr key={sub.id || idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.list}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sub.timestamp * 1000).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
