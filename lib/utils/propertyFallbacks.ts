import type { PropertyData } from '@/types/property';

interface MockPropertyData {
  price: number;
  rent: number;
  taxes: number;
  insurance: number;
  hoa: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
}

const MOCK_DATA: Record<string, MockPropertyData> = {
  "07628": {
    price: 580000,
    rent: 2400,
    taxes: 8500,
    insurance: 1200,
    hoa: 0,
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    yearBuilt: 1985
  },
  "07093": {
    price: 660000,
    rent: 2900,
    taxes: 9200,
    insurance: 1350,
    hoa: 250,
    propertyType: "Townhouse",
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2200,
    yearBuilt: 1990
  },
  "11201": {
    price: 850000,
    rent: 3500,
    taxes: 11000,
    insurance: 1500,
    hoa: 350,
    propertyType: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    yearBuilt: 2005
  }
};

const DEFAULT_FALLBACK: MockPropertyData = {
  price: 500000,
  rent: 2000,
  taxes: 7000,
  insurance: 1000,
  hoa: 0,
  propertyType: "Single Family",
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 1600,
  yearBuilt: 1990
};

export const extractZipCode = (address: string): string | null => {
  const zipMatch = address.match(/\b\d{5}\b/);
  return zipMatch ? zipMatch[0] : null;
};

export const getMockPropertyData = (address: string): PropertyData & { isMockData: boolean } => {
  const zipCode = extractZipCode(address);
  const mockData = zipCode ? MOCK_DATA[zipCode] || DEFAULT_FALLBACK : DEFAULT_FALLBACK;
  
  return {
    ...mockData,
    address,
    isMockData: true,
    lastUpdated: new Date().toISOString()
  };
}; 