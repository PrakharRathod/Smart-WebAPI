import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const RandomUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://randomuser.me/api/');
      if (!response.ok) throw new Error("Failed to fetch user");
      
      const data = await response.json();
      setUser(data.results[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Users className="text-blue-500" size={32} /> Random User Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Generate random user profiles with personal and location information.</p>
      </div>

      {/* Content Area */}
      {loading && !user ? (
        <Loading message="Generating profile..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : user ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 dark:opacity-40"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden shadow-md mb-6 mt-4">
              <img 
                src={user.picture.large} 
                alt={`${user.name.first} ${user.name.last}`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Name */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {user.name.title} {user.name.first} {user.name.last}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 capitalize mb-8">
              {user.gender} • {user.dob.age} years old
            </p>
            
            {/* Info Grid */}
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Mail size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={fetchUser} 
              disabled={loading}
              className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> 
              {loading ? "Generating..." : "Generate New User"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RandomUser;
