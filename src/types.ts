export type PropertyType = 'Apartamento' | 'Studio / Suite' | 'Penthouse' | 'Casa' | 'Casa Urbana';
export type PropertyStatus = 'Entrega Inmediata' | 'Sobre Planos' | 'Usado Remodelado' | 'En Construcción';
export type LoanType = 'hipotecario' | 'leasing';

export interface BogotaZone {
  id: string;
  name: string;
  locality: string;
  sector: 'Norte' | 'Centro-Oriente' | 'Occidente' | 'Noroccidente';
  estrato: 3 | 4 | 5 | 6;
  avgPriceM2Sale: number; // in COP
  avgPriceM2Rent: number; // in COP
  capRate: number; // percentage e.g. 6.8
  annualAppreciation: number; // percentage e.g. 7.5
  description: string;
  keyCorridors: string[];
  highlights: string[];
  tenantProfile: string;
  transportAccess: string;
  vacancyRateMonths: number;
  activeOfferUnits: number;
  mapCoordinates: { x: number; y: number }; // SVG relative coordinate (0-100)
}

export interface PropertyListing {
  id: string;
  title: string;
  zoneId: string;
  zoneName: string;
  locality: string;
  estrato: 3 | 4 | 5 | 6;
  type: PropertyType;
  priceCop: number; // e.g. 480000000 ($480M)
  areaM2: number;
  pricePerM2: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  monthlyAdminCop: number;
  estimatedMonthlyRentCop: number;
  status: PropertyStatus;
  deliveryYear?: number;
  imageUrl: string;
  features: string[];
  airbnbFriendly: boolean;
  addressApprox: string;
}

export interface MarketIndicator {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  unit?: string;
  change: string;
  isPositive: boolean;
  period: string;
  description: string;
  iconName: string;
}

export interface SimulationParams {
  propertyPriceCop: number;
  downPaymentPercent: number; // 20 - 50%
  loanType: LoanType;
  interestRateEA: number; // e.g. 11.8% E.A.
  termYears: number; // 5 - 25 years
  monthlyRentalIncomeCop: number;
  monthlyAdminCop: number;
  annualPropertyTaxCop: number;
  vacancyRatePercent: number; // e.g. 5%
}

export interface SimulationResult {
  downPaymentCop: number;
  loanAmountCop: number;
  monthlyBankQuotaCop: number;
  closingCostsCop: {
    notaryCop: number;
    registryCop: number;
    beneficenciaCop: number;
    totalClosingCop: number;
  };
  totalMonthlyExpensesCop: number;
  netMonthlyRentCop: number;
  monthlyNetCashFlowCop: number;
  grossCapRate: number;
  netCapRate: number;
  totalInvestmentFirstYearCop: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
