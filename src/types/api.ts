
import { Pool, Booking, User, Review } from './index';

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

// API Request interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface CrmSyncRequest {
  crmType: 'salesforce' | 'hubspot' | 'zoho' | 'custom';
  crmEndpoint?: string;
  authToken?: string;
  data: unknown;
}

// CRM Webhook payload structure
export interface CrmWebhookPayload {
  eventType: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'user_created' | 'review_submitted';
  timestamp: string;
  data: unknown;
  signature?: string;
}

// CRM Connection Status
export interface CrmConnectionStatus {
  connected: boolean;
  crmType?: string;
  lastSynced?: string;
  webhookConfigured?: boolean;
}

// Modify the rental period from hourly to daily in relevant interfaces if needed
