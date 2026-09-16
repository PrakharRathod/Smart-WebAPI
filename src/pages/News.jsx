import { useState, useEffect } from 'react';
import { Search, Newspaper, ExternalLink, Calendar } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const News = () => {
  const [query, setQuery] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      // Using Spaceflight News API which is 100% free and has NO CORS issues.
      // We pass the search query if provided.
      const url = searchQuery 
        ? `https://api.spaceflightnewsapi.net/v4/articles/?search=${encodeURIComponent(searchQuery)}&limit=12`
        : `https://api.spaceflightnewsapi.net/v4/articles/?limit=12`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch news");
      
      const data = await response.json();
      setNews(data.results);
    } catch (err) {
      setError("Unable to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchNews(query);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Newspaper className="text-blue-500" size={32} /> Space & Tech News
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Stay updated with the latest spaceflight and technology headlines (Free API, No Key Needed).</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search news (e.g., SpaceX, NASA, Mars)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Content Area */}
      {loading ? (
        <Loading message="Fetching latest news..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : news.length === 0 ? (
        <div className="text-center p-8 text-slate-500 dark:text-slate-400">
          No news found for this topic. Try another search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <div key={article.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all flex flex-col h-full group">
              {article.image_url ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Newspaper className="text-slate-300 dark:text-slate-700 w-16 h-16" />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  <span>{article.news_site}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
                  {article.summary || "No description available."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1">
                    <Calendar size={14} />
                    {new Date(article.published_at).toLocaleDateString()}
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors gap-1"
                  >
                    Read More <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
