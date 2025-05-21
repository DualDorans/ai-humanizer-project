import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getUserCredits } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { TrendingUp, FileText, Clock } from 'lucide-react';

interface ProjectStatsProps {
  user: User;
  projectCount: number;
}

export default function ProjectStats({ user, projectCount }: ProjectStatsProps) {
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const userCredits = await getUserCredits(user.id);
        setCredits(userCredits);
      } catch (error) {
        console.error('Error loading credits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredits();
  }, [user.id]);

  const stats = [
    {
      name: 'Available Words',
      value: isLoading ? '...' : credits.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-primary-100 text-primary-600',
      description: 'Words available for humanization',
    },
    {
      name: 'Total Projects',
      value: projectCount.toString(),
      icon: FileText,
      color: 'bg-secondary-100 text-secondary-600',
      description: 'Completed text humanizations',
    },
    {
      name: 'Account Age',
      value: '14 days',
      icon: Clock,
      color: 'bg-accent-100 text-accent-600',
      description: 'Time since account creation',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card p-6">
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{stat.description}</p>
          
          {index === 0 && credits < 1000 && (
            <div className="mt-4">
              <Link to="/pricing" className="btn btn-primary btn-sm w-full">
                Get More Words
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}