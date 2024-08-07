import { NextResponse } from 'next/server';
import config2 from '../../../config2'; 

const { API_KEY, API_URL } = config2;


export async function GET() {
    const url = `${API_URL}/v1/stock/market-status?exchange=US&token=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data); 
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 }); 
    }
}
