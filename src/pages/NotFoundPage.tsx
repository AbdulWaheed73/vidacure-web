import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page not found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-6">
          <Link to="/">
            <Button className="w-full">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
