import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, History } from 'lucide-react';

const CurrencyConverter = ({ onBackToHome }) => {
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [conversion, setConversion] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: 1,
    result: 0
  });
  const [historicalData, setHistoricalData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  // Fetch available currencies
  useEffect(() => {
    fetchCurrencies();
    fetchExchangeRates();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchExchangeRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const currencyList = Object.keys(data.rates).map(code => ({
        code,
        name: getCurrencyName(code)
      }));
      setCurrencies(currencyList);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${conversion.fromCurrency}`);
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date(data.time_last_updated * 1000).toLocaleTimeString());
      
      // Perform conversion
      performConversion(data.rates);
      
      // Fetch historical data for the selected pair
      fetchHistoricalData(conversion.fromCurrency, conversion.toCurrency);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
    setLoading(false);
  };

  const fetchHistoricalData = async (from, to) => {
    try {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 7);
      
      const formatDate = (date) => date.toISOString().split('T')[0];
      
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/history/${from}/${formatDate(pastDate)}/${formatDate(today)}`
      );
      const data = await response.json();
      
      const historicalPoints = Object.entries(data.rates).map(([date, rates]) => ({
        date,
        rate: rates[to]
      })).slice(-5); // Get last 5 days
      
      setHistoricalData(historicalPoints);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const performConversion = (rates = exchangeRates) => {
    if (!rates[conversion.toCurrency]) return;
    
    const result = conversion.amount * rates[conversion.toCurrency];
    setConversion(prev => ({
      ...prev,
      result: parseFloat(result.toFixed(4))
    }));
  };

  const handleSwapCurrencies = () => {
    setConversion(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      result: 0
    }));
  };

  const getCurrencyName = (code) => {
    const currencyNames = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      JPY: 'Japanese Yen',
      CAD: 'Canadian Dollar',
      AUD: 'Australian Dollar',
      CHF: 'Swiss Franc',
      CNY: 'Chinese Yuan',
      INR: 'Indian Rupee',
      MXN: 'Mexican Peso'
    };
    return currencyNames[code] || code;
  };

  const getTrendIcon = () => {
    if (historicalData.length < 2) return null;
    const latest = historicalData[historicalData.length - 1].rate;
    const previous = historicalData[0].rate;
    return latest > previous ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBackToHome} className="p-2 hover:bg-gray-100 rounded-lg transition">
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">💱 Currency Converter</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {lastUpdated && (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Updated: {lastUpdated}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Converter Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Live Currency Converter</h2>
            
            {/* From Currency */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Amount & From Currency</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={conversion.amount}
                  onChange={(e) => {
                    setConversion(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }));
                    performConversion();
                  }}
                  min="0"
                  step="0.01"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-xl"
                  placeholder="0.00"
                />
                <select
                  value={conversion.fromCurrency}
                  onChange={(e) => {
                    setConversion(prev => ({ ...prev, fromCurrency: e.target.value }));
                  }}
                  className="w-32 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <button
                onClick={handleSwapCurrencies}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                title="Swap currencies"
              >
                ⇅
              </button>
            </div>
            
            {/* To Currency */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">To Currency</label>
              <div className="flex gap-4">
                <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-xl bg-gray-50">
                  {loading ? 'Loading...' : conversion.result.toLocaleString()}
                </div>
                <select
                  value={conversion.toCurrency}
                  onChange={(e) => {
                    setConversion(prev => ({ ...prev, toCurrency: e.target.value }));
                  }}
                  className="w-32 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Conversion Details */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  1 {conversion.fromCurrency} = {exchangeRates[conversion.toCurrency]?.toFixed(4) || '...'} {conversion.toCurrency}
                </p>
                <p className="text-gray-600">
                  1 {conversion.toCurrency} = {(1 / (exchangeRates[conversion.toCurrency] || 1)).toFixed(4)} {conversion.fromCurrency}
                </p>
              </div>
              
              {historicalData.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Last 5 days trend:</span>
                    </div>
                    {getTrendIcon()}
                  </div>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {historicalData.map((point, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-500">
                          {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-sm font-semibold">
                          {point.rate.toFixed(4)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={fetchExchangeRates}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating Rates...' : 'Refresh Rates'}
            </button>
          </div>
          
          {/* Popular Rates */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Popular Exchange Rates</h2>
            
            <div className="space-y-4">
              {[
                { from: 'USD', to: 'EUR', name: 'USD → Euro' },
                { from: 'USD', to: 'GBP', name: 'USD → Pound' },
                { from: 'USD', to: 'JPY', name: 'USD → Yen' },
                { from: 'EUR', to: 'GBP', name: 'Euro → Pound' },
                { from: 'EUR', to: 'CHF', name: 'Euro → Franc' },
                { from: 'GBP', to: 'USD', name: 'Pound → USD' },
              ].map((pair, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold">{pair.name}</p>
                    <p className="text-sm text-gray-500">
                      Base: 1 {pair.from}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      {exchangeRates[pair.to] ? exchangeRates[pair.to].toFixed(4) : '...'} {pair.to}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pair.from}/{pair.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Rate Change Calculator */}
            <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold mb-3">Percentage Change Calculator</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Old rate"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="New rate"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
                  Calculate % Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;