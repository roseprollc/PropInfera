import { NextResponse } from 'next/server';
import { getMockPropertyData } from '@/lib/utils/propertyFallbacks';
import type { PropertyData } from '@/types/property';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Try to get mock data first
    const mockData = getMockPropertyData(address);

    // In the future, we can add real scraping logic here
    // For now, we'll just use the mock data
    const propertyData: PropertyData & { isMockData: boolean } = {
      ...mockData,
      isMockData: true
    };

    return NextResponse.json(propertyData);
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import property data' },
      { status: 500 }
    );
  }
} 