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
  customer: {
    name: string;
    email: string;
  };
  mailLogs: {
    contentTitle: string;
  }[];
  locations?: any;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRooms?: number | null;
  maxRooms?: number | null;
}

export interface Property {
  id: string;
  listingNo: string;
  title?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'PROCESSING';
  transactionType: 'SALE' | 'RENT';
  propertyType: string;
  location: string;
  price: number;
  currency: string;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
} 