interface LoadingSpinnerProps {
  message?: string;
  clientType?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  clientType 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium">{message}</p>
        {clientType && (
          <p className="text-sm opacity-75 mt-2">Client: {clientType}</p>
        )}
      </div>
    </div>
  );
};
