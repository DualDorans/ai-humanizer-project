import { useState } from 'react';
import { toast } from 'react-toastify';
import { User } from '@supabase/supabase-js';
import { humanizeText, saveProject } from '../../lib/supabase';

interface NewProjectFormProps {
  user: User;
  onProjectCreated: () => void;
}

export default function NewProjectForm({ user, onProjectCreated }: NewProjectFormProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await humanizeText(inputText);
      
      if (result.success) {
        setOutputText(result.data || '');
        toast.success('Text humanized successfully!');
      } else {
        toast.error(result.error || 'Failed to humanize text');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!inputText.trim() || !outputText.trim()) {
      toast.error('Both input and output text are required to save');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const result = await saveProject(user.id, inputText, outputText);
      
      if (result.success) {
        toast.success('Project saved successfully!');
        setInputText('');
        setOutputText('');
        onProjectCreated();
      } else {
        toast.error(result.error || 'Failed to save project');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        New Humanization Project
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input text area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">
              AI-Generated Text
            </label>
            <button
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={() => setInputText('')}
              disabled={!inputText || isLoading}
            >
              Clear
            </button>
          </div>
          <textarea
            id="input-text"
            className="w-full h-40 p-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
            placeholder="Paste your AI-generated text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          ></textarea>
        </div>
        
        {/* Output text area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="output-text" className="block text-sm font-medium text-gray-700">
              Humanized Text
            </label>
            {outputText && (
              <button
                className="text-sm text-primary-600 hover:text-primary-700"
                onClick={() => {
                  navigator.clipboard.writeText(outputText);
                  toast.success('Copied to clipboard');
                }}
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            id="output-text"
            className="w-full h-40 p-3 rounded-lg border border-gray-300 bg-gray-50 resize-none"
            placeholder="Humanized text will appear here..."
            value={outputText}
            readOnly
          ></textarea>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleHumanize}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Humanizing...
            </span>
          ) : (
            'Humanize Text'
          )}
        </button>
        
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving || !inputText.trim() || !outputText.trim()}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Project'
          )}
        </button>
      </div>
    </div>
  );
}