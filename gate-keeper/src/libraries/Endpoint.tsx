import {
    PostData, DeleteData, GetData, BuildUrl
 } from './Utils';
import {
    API_PATHS, API_BASE_URL
} from './Paths';

const ENDPOINT_API_BASE_URL = BuildUrl(API_BASE_URL, API_PATHS["endpoint"]);

export async function CreateEndpoint(data: Record<string, any>): Promise<any> {
  return PostData(ENDPOINT_API_BASE_URL, data);
}

export async function ListEndpoints(pageNumber: number, itemsPerPage: number): Promise<any> {
    const queryParams = {
      pageNumber: pageNumber.toString(),
      itemsPerPage: itemsPerPage.toString()
    };
  
    const endpoints = await GetData(ENDPOINT_API_BASE_URL, queryParams);
    
    return endpoints.map((endpoint: any) => createEndpointData(endpoint));
  }

export async function DeleteEndpoint(id: string): Promise<void> {
  await DeleteData(`${ENDPOINT_API_BASE_URL}/${id}`);
}

export async function CreateEndpointInBulk(data: Array<Record<string, any>>): Promise<any> {
  const url = `${ENDPOINT_API_BASE_URL}/batch`;
  return PostData(url, data, { 'Content-Type': 'application/json' }, false);
}

function createEndpointData(org: any): EndpointData {
    return {
      id: org.id,
      name: org.name,
      description: org.created_at,
    };
}

interface EndpointData {
    id: number;
    name: string;
    description: string;
    [key: string]: any;
}