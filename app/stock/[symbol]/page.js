"use client";

import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

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

    // Convert API data to a format suitable for Plotly
    const timeSeries = data['Time Series (5min)'] || {};
    const labels = Object.keys(timeSeries);
    const openPrices = labels.map(time => parseFloat(timeSeries[time]['1. open']));
    const highPrices = labels.map(time => parseFloat(timeSeries[time]['2. high']));
    const lowPrices = labels.map(time => parseFloat(timeSeries[time]['3. low']));
    const closePrices = labels.map(time => parseFloat(timeSeries[time]['4. close']));

    return (
        <div>
        <h1 className="text-2xl font-extrabold text-center text-gray-800 ">
        Stock Chart for {symbol}
        </h1>
            <Plot
                data={[
                    {
                        x: labels,
                        y: openPrices,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Open Price',
                        line: { color: 'blue' },
                    },
                    {
                        x: labels,
                        y: highPrices,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'High Price',
                        line: { color: 'green' },
                    },
                    {
                        x: labels,
                        y: lowPrices,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Low Price',
                        line: { color: 'red' },
                    },
                    {
                        x: labels,
                        y: closePrices,
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Close Price',
                        line: { color: 'purple' },
                    },
                ]}
                layout={{
                    xaxis: { title: 'Time' },
                    yaxis: { title: 'Price' },
                    autosize: true,
                }}
                style={{ width: '100%', height: '550px' }}
            />
        </div>
    );
}
