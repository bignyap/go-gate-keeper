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
      pageNumber: pageNumber.toString(),
      itemsPerPage: itemsPerPage.toString()
    };
  
    const organizations = await GetData(ORGANIZATION_API_BASE_URL, queryParams);
    
    return organizations.map((org: any) => createOrganizationData(org));
  }

export async function GetOrganizationById(id: string): Promise<any> {
  return GetData(`${ORGANIZATION_API_BASE_URL}/${id}`);
}

export async function DeleteOrganization(id: string): Promise<void> {
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