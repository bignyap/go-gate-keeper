// import UserService from '../services/UserService';

// import config from "../config"

// function getChatServicePaths (pathName: string): string {
//   return config.chatServiceUrl + api_paths["chatService"][pathName]
// }

const defaultHeaders: Record<string, string> = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded'
}

async function headerWithToken(
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<Record<string, string>> {
  return defaultHeaders
  // const loggedIn = await UserService.isLoggedIn()
  // // Check if user is logged in and add token to headers if available
  // if (loggedIn) {
  //   const token = UserService.getToken();
  //   if (includeDefaultHeader) {
  //     return { ...defaultHeaders, ...headers, 'Authorization': `Bearer ${token}` };
  //   } else {
  //     return { ...headers, 'Authorization': `Bearer ${token}` };
  //   }
  // } else {
  //   await UserService._kc.login();
  // }
}

async function postData(
  url: string, 
  data: Record<string, any> = {}, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: reqHeaders,
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    body: new URLSearchParams(data) // Always use URLSearchParams for form data
  };
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}

async function putData(
  url: string, 
  data: Record<string, any> = {}, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: reqHeaders,
    mode: "cors",
    cache: "no-cache",
    referrerPolicy: "no-referrer",
    body: new URLSearchParams(data) // Always use URLSearchParams for form data
  };
  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}

async function getData(
  url: string, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  try {
    const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
    const response = await fetch(url, {
      method: 'GET',
      headers: reqHeaders
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}

async function deleteData(
  url: string, 
  headers: Record<string, string> = {}, 
  includeDefaultHeader: boolean = true
): Promise<any> {
  try {
    const reqHeaders = await headerWithToken(headers, includeDefaultHeader);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: reqHeaders
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Propagate the error
  }
}