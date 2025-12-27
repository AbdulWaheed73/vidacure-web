interface LoadingSpinnerProps {
  message?: string;
  clientType?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  clientType
}) => {
  return (
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
      {message && <p className="text-sm text-zinc-600 mt-3">{message}</p>}
      {clientType && <p className="text-xs text-zinc-400 mt-1">Client: {clientType}</p>}
    </div>
  );
};
