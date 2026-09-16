import { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Download, ExternalLink } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Unsplash = () => {
  const [query, setQuery] = useState('space');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchImages = async (searchQuery) => {
    setLoading(true);
    setError('');
    try {
      // Using NASA Image API which is 100% free and requires no API key!
      const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`);
      if (!response.ok) throw new Error("Failed to fetch images");
      
      const data = await response.json();
      
      // The NASA API has a specific nested structure
      const fetchedImages = data.collection.items
        .slice(0, 12) // Limit to 12
        .filter(item => item.links && item.links.length > 0) // Ensure it has an image link
        .map(item => ({
          id: item.data[0].nasa_id,
          title: item.data[0].title,
          center: item.data[0].center,
          imageUrl: item.links[0].href,
        }));

      setImages(fetchedImages);
    } catch (err) {
      setError("Unable to load images from NASA API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchImages(query);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <ImageIcon className="text-blue-500" size={32} /> NASA Image Gallery
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Search and discover beautiful high-quality images powered by the free NASA Image API.</p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search space images (e.g., Apollo, Galaxy, Mars)..."
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
        <Loading message="Fetching images..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : images.length === 0 ? (
        <div className="text-center p-8 text-slate-500 dark:text-slate-400">
          No images found. Try another search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all group flex flex-col">
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a 
                    href={image.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer"
                    title="View Full Image"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              
              <div className="p-4 flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2" title={image.title}>
                  {image.title}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Source: {image.center}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Unsplash;
