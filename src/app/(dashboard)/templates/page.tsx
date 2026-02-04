'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Template = {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error loading templates', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        <Link 
          href="/templates/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Create New Template
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              No templates found. Create one to get started.
            </div>
          ) : (
            templates.map((tmpl) => (
              <div key={tmpl.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow p-5 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tmpl.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Subject: {tmpl.subject}</p>
                <div className="mt-auto flex justify-end space-x-2">
                  <button 
                    onClick={() => router.push(`/campaigns/new?templateId=${tmpl.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Use this Template
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
