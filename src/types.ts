export interface PriceListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  unit?: string;
  features?: string[];
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  website: string;
  address: string;
  logoUrl?: string;
}

export interface PriceList {
  id: string;
  title: string;
  description: string;
  items: PriceListItem[];
  businessInfo: BusinessInfo;
  currency: string;
  createdAt: number;
  updatedAt: number;
  status: 'draft' | 'published';
  theme: 'modern' | 'editorial' | 'minimal';
}
