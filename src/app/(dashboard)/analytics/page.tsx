'use client';

import { useState, useEffect } from 'react';

type CampaignStats = {
  id: string;
  title: string;
  subject: string;
  sent: number;
  opens: number;
  openRate: string;
  date: string; // UNIX timestamp as string
};

type AnalyticsData = {
  overview: {
    totalSent: number;
    totalOpened: number;
    globalOpenRate: string;
  };
  recentCampaigns: CampaignStats[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/sendy/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Campaign Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Emails Sent</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {new Intl.NumberFormat().format(data.overview.totalSent)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Opens</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {new Intl.NumberFormat().format(data.overview.totalOpened)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Global Open Rate</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {data.overview.globalOpenRate}%
          </p>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Campaigns</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentCampaigns.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No campaigns found.</td>
                </tr>
              ) : (
                data.recentCampaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{camp.title}</div>
                      <div className="text-sm text-gray-500">{camp.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat().format(camp.sent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat().format(camp.opens)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseFloat(camp.openRate) > 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {camp.openRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {camp.date ? new Date(parseInt(camp.date) * 1000).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
