'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, BarChart3, Sparkles, Layout, CheckCircle2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Skill = {
  id: string;
  name: string;
  description: string;
  version: string;
  installed: boolean;
  icon: string;
  category: string;
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkill = async (skill: Skill) => {
    setProcessingId(skill.id);
    const action = skill.installed ? 'uninstall' : 'install';
    
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skill.id, action })
      });

      if (res.ok) {
        // Optimistic update
        setSkills(prev => prev.map(s => 
          s.id === skill.id ? { ...s, installed: !s.installed } : s
        ));
      }
    } catch (error) {
      console.error('Error updating skill', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Link2': return <Link2 className="h-6 w-6 text-blue-600" />;
      case 'BarChart3': return <BarChart3 className="h-6 w-6 text-purple-600" />;
      case 'Sparkles': return <Sparkles className="h-6 w-6 text-yellow-600" />;
      case 'Layout': return <Layout className="h-6 w-6 text-green-600" />;
      default: return <Link2 className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Skills & Integrations
        </h1>
        <p className="mt-2 text-gray-600">
          Supercharge your dashboard by adding new capabilities and integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id} className={`flex flex-col transition-all duration-200 ${skill.installed ? 'border-blue-200 bg-blue-50/20' : 'hover:shadow-md'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                  {getIcon(skill.icon)}
                </div>
                {skill.installed && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Installed
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4 text-xl">{skill.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {skill.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="flex items-center gap-2 text-sm text-gray-500">
                 <Badge variant="outline" className="font-normal">{skill.category}</Badge>
                 <span>v{skill.version}</span>
               </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-gray-100">
              <Button 
                variant={skill.installed ? "outline" : "default"}
                className={`w-full ${skill.installed ? 'border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => handleToggleSkill(skill)}
                disabled={processingId === skill.id}
              >
                {processingId === skill.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : skill.installed ? (
                    'Uninstall'
                ) : (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Skill
                    </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
