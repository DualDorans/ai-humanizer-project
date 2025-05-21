import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-gray-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-primary-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">
          We couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}