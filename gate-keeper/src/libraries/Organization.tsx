import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const ORGANIZATION_API_BASE_URL = BuildUrl(API_BASE_URL, API_PATHS["organization"]);

export async function CreateOrganization(data: Record<string, any>): Promise<any> {
  return PostData(ORGANIZATION_API_BASE_URL, data);
}

export async function ListOrganizations(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      page_number: pageNumber.toString(),
      items_per_page: itemsPerPage.toString()
    };
  
    let organizations = await GetData(ORGANIZATION_API_BASE_URL, queryParams);

    if (organizations["total_items"] > 0) {
      organizations["data"] = organizations["data"].map((org: any) => createOrganizationData(org));
    }
    
    return organizations
  }

export async function GetOrganizationById(id: number): Promise<any> {
  const val = await GetData(`${ORGANIZATION_API_BASE_URL}/${id}`)
  return createOrganizationData(val);
}

export async function DeleteOrganization(id: number): Promise<void> {
  await DeleteData(`${ORGANIZATION_API_BASE_URL}/${id}`);
}

export async function CreateOrganizationInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${ORGANIZATION_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createOrganizationData(org: any): OrganizationData {
    return {
      id: org.id,
      name: org.name,
      type: org.type,
      created_at: org.created_at,
      updated_at: org.updated_at,
      realm: org.realm,
      country: org.country,
      support_email: org.support_email,
      active: org.active,
      report_q: org.report_q,
      config: org.config,
      type_id: org.type_id,
    };
}

interface OrganizationData {
    id: number;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
    realm: string;
    country: string | null;
    support_email: string;
    active: boolean;
    report_q: boolean;
    config: any | null;
    type_id: number;
    [key: string]: any;
}