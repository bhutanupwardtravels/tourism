import { NextResponse } from 'next/server';
import { experiences } from '@/lib/data';

export async function GET() {
    return NextResponse.json(experiences);
}
