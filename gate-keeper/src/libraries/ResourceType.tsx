import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const RESOURCE_TYPE_API_BASE_URL = BuildUrl(API_BASE_URL, API_PATHS["resourceType"]);

export async function CreateResourceType(data: Record<string, any>): Promise<any> {
  return PostData(RESOURCE_TYPE_API_BASE_URL, data);
}

export async function ListResourceTypes(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      pageNumber: pageNumber.toString(),
      itemsPerPage: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(RESOURCE_TYPE_API_BASE_URL, queryParams);
    
    return endpoints.map((endpoint: any) => createResourceTypeData(endpoint));
  }

export async function DeleteResourceType(id: string): Promise<void> {
  await DeleteData(`${RESOURCE_TYPE_API_BASE_URL}/${id}`);
}

export async function CreateResourceTypeInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${RESOURCE_TYPE_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createResourceTypeData(org: any): ResourceTypeData {
    return {
      id: org.id,
      name: org.name,
      code: org.code,
      description: org.description,
    };
}

interface ResourceTypeData {
    id: number;
    name: string;
    code: string;
    description: string;
    [key: string]: any;
}