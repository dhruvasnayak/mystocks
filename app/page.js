"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [symbol, setSymbol] = useState('');
    const [news, setNews] = useState([]);
    const [marketStatus, setMarketStatus] = useState({});
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
