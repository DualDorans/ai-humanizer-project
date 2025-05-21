import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getUserProjects } from '../lib/supabase';
import ProjectStats from '../components/dashboard/ProjectStats';
import ProjectCard from '../components/dashboard/ProjectCard';
import NewProjectForm from '../components/dashboard/NewProjectForm';
import { Inbox } from 'lucide-react';

interface Project {
  id: string;
  input_text: string;
  output_text: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const result = await getUserProjects(user.id);
      
      if (result.success) {
        setProjects(result.data);
      } else {
        toast.error('Failed to load projects');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    // In a real implementation, you would call an API to delete the project
    // For now, we'll just update the UI
    setProjects(projects.filter(project => project.id !== projectId));
    toast.success('Project deleted successfully');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your humanization projects and credits
          </p>
        </div>
        
        <ProjectStats user={user} projectCount={projects.length} />
        
        <NewProjectForm user={user} onProjectCreated={loadProjects} />
        
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Projects
          </h2>
          {projects.length > 0 && (
            <button 
              onClick={loadProjects} 
              className="text-sm text-primary-600 hover:text-primary-700"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
              <Inbox className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No projects yet</h3>
            <p className="mt-2 text-gray-600">
              Start by creating a new humanization project above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}