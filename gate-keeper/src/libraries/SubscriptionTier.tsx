import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const SUBSCRIPTION_TIER_API_BASE_URL = BuildUrl(API_BASE_URL, API_PATHS["subscriptionTier"]);

export async function CreateSubscriptionTier(data: Record<string, any>): Promise<any> {
  return PostData(SUBSCRIPTION_TIER_API_BASE_URL, data);
}

export async function ListSubscriptionTiers(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      pageNumber: pageNumber.toString(),
      itemsPerPage: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(SUBSCRIPTION_TIER_API_BASE_URL, queryParams);
    
    return endpoints.map((endpoint: any) => createSubscriptionTierData(endpoint));
  }

export async function DeleteResourceType(id: string): Promise<void> {
  await DeleteData(`${SUBSCRIPTION_TIER_API_BASE_URL}/${id}`);
}

export async function CreateSubscriptionTierInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${SUBSCRIPTION_TIER_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createSubscriptionTierData(org: any): SubscriptionTierData {
    return {
      id: org.id,
      name: org.name,
      description: org.description,
      created_at: org.created_at,
      updated_at: org.updated_at,
    };
}

interface SubscriptionTierData {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}