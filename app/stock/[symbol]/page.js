"use client"

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function StockPage({ params }) {
    const { symbol } = params; // Get the symbol from the route
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await fetch(`/api/data?symbol=${symbol}&interval=5min`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Convert API data to a format suitable for Chart.js
    const timeSeries = data['Time Series (5min)'] || {};
    const labels = Object.keys(timeSeries);
    const openPrices = labels.map(time => timeSeries[time]['1. open']);
    const highPrices = labels.map(time => timeSeries[time]['2. high']);
    const lowPrices = labels.map(time => timeSeries[time]['3. low']);
    const closePrices = labels.map(time => timeSeries[time]['4. close']);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Open Price',
                data: openPrices,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: false,
            },
            {
                label: 'High Price',
                data: highPrices,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                fill: false,
            },
            {
                label: 'Low Price',
                data: lowPrices,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                fill: false,
            },
            {
                label: 'Close Price',
                data: closePrices,
                borderColor: 'purple',
                backgroundColor: 'rgba(128, 0, 128, 0.2)',
                fill: false,
            },
        ],
    };

    return (
        <div>
            <h1>Stock Chart for {symbol}</h1>
            <Line data={chartData} />
        </div>
    );
}
