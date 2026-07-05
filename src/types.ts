export type CardTheme = 'black' | 'gold' | 'burner';

export interface CreditCardState {
  theme: CardTheme;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isLocked: boolean;
  limit: number;
}

export interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon?: string;
}

export interface FxRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

export interface MetricItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  isPopular: boolean;
  cardTheme: CardTheme;
}
