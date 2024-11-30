import {
    PostData, DeleteData,
    PutData, GetData
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const ORGANIZATION_TYPE_API_BASE_URL = API_BASE_URL + API_PATHS["organizationType"]

export async function CreateOrganizationType(data: Record<string, any>): Promise<any> {
  return PostData(`${ORGANIZATION_TYPE_API_BASE_URL}`, data);
}

export async function ListOrganizationTypes(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      pageNumber: pageNumber.toString(),
      itemsPerPage: itemsPerPage.toString()
    };
    const organizations = await GetData(ORGANIZATION_TYPE_API_BASE_URL, queryParams);
    
    return organizations.map((org: any) => createOrganizationTypeData(org));
  }

export async function DeleteOrganizationType(id: string): Promise<void> {
  await DeleteData(`${ORGANIZATION_TYPE_API_BASE_URL}/${id}`);
}

export async function CreateOrganizationTypeInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${ORGANIZATION_TYPE_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createOrganizationTypeData(org: any): OrganizationTypeData {
    return {
      id: org.id,
      name: org.name,
    };
}

interface OrganizationTypeData {
    id: number;
    name: string;
}