import { useState, useEffect } from 'react';
import { CircleDollarSign, ArrowRightLeft } from 'lucide-react';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Currency = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  // Fetch available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        // Switching to open.er-api.com which is free and very reliable
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) throw new Error('Failed to fetch currencies');
        const data = await res.json();
        
        // This API returns a rates object. We'll use the keys as currency codes.
        const currencyMap = {};
        Object.keys(data.rates).forEach(key => {
          currencyMap[key] = key;
        });
        setCurrencies(currencyMap);
      } catch (err) {
        setError("Could not load currency options.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const handleConvert = async (e) => {
    if (e) e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setConverting(true);
    setError('');
    
    try {
      if (fromCurrency === toCurrency) {
        setResult(parseFloat(amount));
        setRate(1);
        setConverting(false);
        return;
      }
      
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      if (!res.ok) throw new Error('Conversion failed');
      const data = await res.json();
      
      const exchangeRate = data.rates[toCurrency];
      if (!exchangeRate) throw new Error("Currency not supported");
      
      setResult(amount * exchangeRate);
      setRate(exchangeRate);
    } catch (err) {
      setError(err.message);
    } finally {
      setConverting(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <CircleDollarSign className="text-blue-500" size={32} /> Currency Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Convert currencies with real-time exchange rates (Powered by Free Open-Source API).</p>
      </div>

      {loading ? (
        <Loading message="Loading currencies..." />
      ) : error && Object.keys(currencies).length === 0 ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleConvert} className="space-y-6">
            
            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 text-lg font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* From */}
              <div className="w-full space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {Object.keys(currencies).map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="mt-6 p-3 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Swap currencies"
              >
                <ArrowRightLeft size={20} />
              </button>

              {/* To */}
              <div className="w-full space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {Object.keys(currencies).map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors cursor-pointer flex justify-center items-center h-14"
              disabled={converting}
            >
              {converting ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Convert'}
            </button>
          </form>

          {/* Result */}
          {error && <div className="mt-6"><ErrorMessage message={error} /></div>}
          
          {result !== null && !error && !converting && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">Converted Amount</p>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Currency;
