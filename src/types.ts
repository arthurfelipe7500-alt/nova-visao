export interface User {
  id: string;
  username: string;
  name: string;
  role: "ADMIN" | "SELLER" | "CLIENT";
  email: string;
  isApproved: boolean;
  avatar?: string;
  balance?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  price: number;
  currency: string;
  type: "COMPRA" | "ALUGUEL";
  isMonthly?: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  sellerId: string;
  sellerName: string;
  coordinates: { lat: number; lng: number };
  amenities: {
    schools: string;
    pharmacies: string;
    airports: string;
    metro: string;
    supermarket: string;
    hospital: string;
  };
  rooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  tour3d: string[];
  rating: number;
  reviewsCount: number;
}

export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  clientId: string;
  clientName: string;
  sellerId: string;
  sellerName: string;
  propertyTitle: string;
  propertyId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface AdminReport {
  summary: {
    globalVolumeEUR: number;
    commissionRate: string;
    estimatedCommissionEUR: number;
    averageRating: number;
    activeSellers: number;
    pendingSellers: number;
    approvedListings: number;
    pendingListings: number;
    rejectedListings: number;
  };
  monthlyPerformance: {
    month: string;
    vendas: number;
    alugueis: number;
  }[];
  listingsByCountry: {
    country: string;
    count: number;
  }[];
}
