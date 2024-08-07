import { NextResponse } from 'next/server';
import config from '../../../config'; // Adjust the path if needed

const { API_KEY } = config;

export async function GET(request) {
    try {
        // Extract query parameters from the request URL
        const url = new URL(request.url);
        const symbol = url.searchParams.get('symbol'); // Get the 'symbol' query parameter
        const interval = url.searchParams.get('interval') || '5min'; // Default to '5min' if not provided

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
        }

        // Construct the API URL for fetching intraday stock data
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`;

        // Fetch stock data from the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Return the fetched data
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
