import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
              <Zap size={24} className="fill-current" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Smart WebAPI</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Multiple APIs, One Smart Platform. A beginner-friendly React project integrating various external data sources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-around gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/weather" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Weather</Link></li>
                <li><Link to="/news" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">News</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                More APIs
              </h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/currency" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Currency</Link></li>
                <li><Link to="/unsplash" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Unsplash</Link></li>
                <li><Link to="/random-user" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Random User</Link></li>
              </ul>
            </div>
          </div>

        </div>
        
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
            Built with React + Vite + Tailwind CSS
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 md:mt-0 text-center md:text-right">
            &copy; {new Date().getFullYear()} Smart WebAPI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
