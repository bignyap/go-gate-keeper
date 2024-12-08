import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const SUBSCRIPTION_API_BASE_URL = BuildUrl(API_BASE_URL, API_PATHS["subscription"]);

export async function CreateSubscription(data: Record<string, any>): Promise<any> {
  return PostData(SUBSCRIPTION_API_BASE_URL, data);
}

export async function ListSubscriptions(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    const subscriptions = await GetData(SUBSCRIPTION_API_BASE_URL, queryParams);

    if (subscriptions["total_items"] > 0) {
      subscriptions["data"] = subscriptions["data"].map((org: any) => createSubscriptionData(org));
    }
    
    return subscriptions
}

export async function ListSubscriptionByOrgIds(orgId: number, pageNumber: number, itemsPerPage: number): Promise<any> {
  const queryParams = {
    page_number: pageNumber.toString(),
    items_per_page: itemsPerPage.toString()
  };

  
  const finalUrl = BuildUrl(SUBSCRIPTION_API_BASE_URL, "orgId", orgId.toString());

  const subscriptions = await GetData(finalUrl, queryParams);

  if (subscriptions["total_items"] > 0) {
    subscriptions["data"] = subscriptions["data"].map((org: any) => createSubscriptionData(org));
  }
  
  return subscriptions
}

export async function GetSubscriptionById(id: string): Promise<any> {
  return GetData(`${SUBSCRIPTION_API_BASE_URL}/${id}`);
}

export async function GetSubscriptionByOrgId(id: string): Promise<any> {
    return GetData(`${SUBSCRIPTION_API_BASE_URL}/orgId/${id}`);
  }

export async function DeleteSubscription(id: string): Promise<void> {
  await DeleteData(`${SUBSCRIPTION_API_BASE_URL}/${id}`);
}

export async function DeleteSubscriptionByOrgId(id: string): Promise<any> {
    return DeleteData(`${SUBSCRIPTION_API_BASE_URL}${id}`);
  }

export async function CreateSubscriptionInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${SUBSCRIPTION_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createSubscriptionData(sub: any): SubscriptionData {
    return {
      id: sub.id,
      name: sub.name,
      type: sub.tier_name,
      created_at: sub.created_at,
      updated_at: sub.updated_at,
      start_date: sub.start_date,
      api_limit: sub.api_limit,
      expiry_date: sub.expiry_date,
      description: sub.description,
      status: sub.status,
      organization_id: sub.organization_id,
      subscription_tier_id: sub.subscription_tier_id,
    };
}

interface SubscriptionData {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    start_date: string;
    api_limit: number;
    expiry_date: string;
    description: string;
    status: boolean;
    organization_id: number;
    subscription_tier_id: number;
    type: string;
    [key: string]: any;
}