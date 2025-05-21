import { useState } from 'react';
import { Clock, Copy, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface Project {
  id: string;
  input_text: string;
  output_text: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const handleCopy = (text: string, type: 'input' | 'output') => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === 'input' ? 'Original' : 'Humanized'} text copied to clipboard`);
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(project.created_at)}</span>
          </div>
          <button
            onClick={() => onDelete(project.id)}
            className="text-gray-400 hover:text-error-500 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Original Text</h3>
            <button
              onClick={() => handleCopy(project.input_text, 'input')}
              className="text-primary-600 hover:text-primary-700 transition-colors"
              aria-label="Copy original text"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm">
            {isExpanded ? project.input_text : truncateText(project.input_text)}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">Humanized Text</h3>
            <button
              onClick={() => handleCopy(project.output_text, 'output')}
              className="text-primary-600 hover:text-primary-700 transition-colors"
              aria-label="Copy humanized text"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-primary-50 p-3 rounded-lg text-gray-700 text-sm">
            {isExpanded ? project.output_text : truncateText(project.output_text)}
          </div>
        </div>
        
        {(project.input_text.length > 150 || project.output_text.length > 150) && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}