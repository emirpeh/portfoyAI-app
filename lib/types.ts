export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  customerType: 'BUYER' | 'SELLER' | 'BOTH' | 'UNKNOWN';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId?: string | null;
}

export interface PropertySearchRequest {
  id: string;
  requestNo: string;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED' | 'REJECTED';
  transactionType: 'SALE' | 'RENT';
  createdAt: string;
  notes?: string | null;
  customer?: Customer | null;
  locations?: any;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRooms?: number | null;
  maxRooms?: number | null;
  details?: {
    propertyTypes?: string[];
    locations?: string[];
    roomCount?: string[];
    minBudget?: number;
    maxBudget?: number;
    features?: string[];
  } | null;
}

export interface DashboardStats {
  totalListings: number;
  totalCustomers: number;
  activeRequests: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentRequests: PropertySearchRequest[];
}

export interface Lead {
  id: string;
  requestNo: string;
  status: 'ACTIVE' | 'PENDING' | 'CLOSED' | 'REJECTED';
  transactionType: 'SALE' | 'RENT';
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  mailLogs: { contentTitle: string }[];
  notes?: string | null;
  details?: {
    propertyTypes?: string[];
    roomCount?: string[];
    locations?: string[];
    minBudget?: number;
    maxBudget?: number;
    features?: string[];
  } | null;
  locations?: any;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRooms?: number | null;
  maxRooms?: number | null;
}

export interface Property {
  id: string;
  listingNo: string;
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'PROCESSING' | 'SOLD' | 'RENTED';
  transactionType: 'SALE' | 'RENT';
  location: string;
  price: number;
  currency: string;
  updatedAt: string;
  seller: {
    name: string;
    email: string | null;
  };
} 