"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// JSON data
const companySymbols = [
    { "name": "Apple Inc.", "symbol": "AAPL" },
    { "name": "Microsoft Corporation", "symbol": "MSFT" },
    { "name": "Amazon.com, Inc.", "symbol": "AMZN" },
    { "name": "Alphabet Inc. (Google)", "symbol": "GOOGL" },
    { "name": "Meta Platforms, Inc. (Facebook)", "symbol": "META" },
    { "name": "Tesla, Inc.", "symbol": "TSLA" },
    { "name": "NVIDIA Corporation", "symbol": "NVDA" },
    { "name": "Netflix, Inc.", "symbol": "NFLX" },
    { "name": "Advanced Micro Devices, Inc. (AMD)", "symbol": "AMD" },
    { "name": "Intel Corporation", "symbol": "INTC" },
    { "name": "Visa Inc.", "symbol": "V" },
    { "name": "Johnson & Johnson", "symbol": "JNJ" },
    { "name": "Procter & Gamble Co.", "symbol": "PG" },
    { "name": "Walmart Inc.", "symbol": "WMT" },
    { "name": "PayPal Holdings, Inc.", "symbol": "PYPL" },
    { "name": "Coca-Cola Company", "symbol": "KO" },
    { "name": "PepsiCo, Inc.", "symbol": "PEP" },
    { "name": "McDonald's Corporation", "symbol": "MCD" },
    { "name": "Nike, Inc.", "symbol": "NKE" },
    { "name": "Disney (The Walt Disney Company)", "symbol": "DIS" },
    { "name": "IBM (International Business Machines Corporation)", "symbol": "IBM" },
    { "name": "Cisco Systems, Inc.", "symbol": "CSCO" },
    { "name": "Oracle Corporation", "symbol": "ORCL" },
    { "name": "Berkshire Hathaway Inc.", "symbol": "BRK.A" },
    { "name": "Exxon Mobil Corporation", "symbol": "XOM" }
];

export default function Home() {
    const [symbol, setSymbol] = useState('');
    const [news, setNews] = useState([]);
    const [marketStatus, setMarketStatus] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch('/api/news'); // Replace with your actual API route
                const data = await response.json();
                // Filter and sort the news items
                const topNews = data
                    .filter(item => item.category === 'top news')
                    .slice(0, 10);
                setNews(topNews);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }

        async function fetchMarketStatus() {
            try {
                const response = await fetch('/api/market-status');
                const data = await response.json();
                setMarketStatus(data);
            } catch (error) {
                console.error('Error fetching market status:', error);
            }
        }

        fetchNews();
        fetchMarketStatus();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        if (symbol) {
            router.push(`/stock/${symbol}`);
        }
    };

    const handleDropdownSelect = (selectedSymbol) => {
        setSymbol(selectedSymbol);
        setShowDropdown(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3 bg-blue-100 p-4 rounded-lg shadow-md">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <h1 className="text-4xl font-extrabold text-gray-900">myStocks</h1>
                </div>
                <form onSubmit={handleSearch} className="flex items-center">
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="Enter company symbol"
                        className="border border-gray-300 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 shadow-sm hover:shadow-md"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition-colors duration-300">Search</button>
                </form>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="ml-4 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                    Select Company
                </button>
                {showDropdown && (
                    <div className="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                        {companySymbols.map((company) => (
                            <button
                                key={company.symbol}
                                onClick={() => handleDropdownSelect(company.symbol)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                {company.name} ({company.symbol})
                            </button>
                        ))}
                    </div>
                )}
            </header>
            <main>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Market Status</h2>
                    <div className="bg-white p-2 rounded-lg shadow-lg flex items-center space-x-6">
                        <p className="text-gray-800 text-sm"><strong>Holiday:</strong> {marketStatus.holiday ? marketStatus.holiday : 'No'}</p>
                        <p className="text-gray-800 text-sm"><strong>Market Open:</strong> {marketStatus.isOpen ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                <h2 className="text-3xl font-semibold mb-6">Top News</h2>
                <div className="space-y-6">
                    {news.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 bg-white p-4 rounded-lg shadow-lg">
                            <img
                                src={item.image}
                                alt={item.headline}
                                className="w-full md:w-32 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">{item.headline}</h3>
                                <p className="text-gray-600 text-sm mt-1">{new Date(item.datetime * 1000).toLocaleDateString()}</p>
                                <p className="text-gray-800 mt-2">{item.summary}</p>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 mt-2 inline-block hover:underline"
                                >
                                    Read more
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
