import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message = "Something went wrong. Please try again." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
      <AlertCircle className="w-10 h-10 mb-3" />
      <p className="text-lg font-medium text-center">{message}</p>
    </div>
  );
};

export default ErrorMessage;
