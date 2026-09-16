import { Loader2 } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loading;
