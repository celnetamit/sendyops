'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  title: string;
  subject: string;
  content?: string;
}

function CreateCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    content: '',
    category: 'general',
  });

  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    try {
      const res = await fetch('/api/templates');
      const templates: Template[] = await res.json();
      const template = templates.find((t) => t.id === id);
      if (template) {
        setFormData(prev => ({
          ...prev,
          title: `Copy of ${template.title}`,
          subject: template.subject,
          content: template.content || ''
        }));
      }
    } catch (error) {
      console.error('Failed to load template', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/campaigns');
        router.refresh();
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Workshop</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <Input
              required
              placeholder="Internal Name"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
             >
                <option value="general">General</option>
                <option value="courses">Courses</option>
                <option value="workshops">Workshops</option>
             </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
          <Input
            required
            placeholder="Subject line for recipients"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
            <Input
              required
              placeholder="e.g. John Doe"
              value={formData.fromName}
              onChange={(e) => setFormData({...formData, fromName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
            <Input
              required
              type="email"
              placeholder="john@example.com"
              value={formData.fromEmail}
              onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Content (HTML)</label>
          <div className="text-xs text-gray-500 mb-2">Editor placeholder - pasting raw HTML supported</div>
          <Textarea
            required
            rows={15}
            className="font-mono text-sm"
            placeholder="<html>...</html>"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Saving...' : 'Create Draft'}
          </Button>
        </div>

      </form>
    </div>
  );
}

export default function CreateCampaignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateCampaignContent />
        </Suspense>
    )
}
