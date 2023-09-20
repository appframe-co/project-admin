import { TProject } from '@/types';
import { headers } from 'next/headers'

export async function getProject(requestHeaders?: Headers): Promise<TErrorResponse|{project:TProject}> {
  try {
    const headerName = 'X-AppFrame-Access-Token';
    const accessToken = (requestHeaders ?? headers()).get(headerName) as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/project/`, {
    method: 'GET',
    headers: { [headerName]: accessToken}
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    let message = 'Error fetch project';

    if (e instanceof Error) {
      message = e.message;
    }

    return {error: message};
  }
}

export async function getAccessTokenProject(): Promise<TErrorResponse|{projectId: string, accessToken: string}> {
  try {
    const accessToken = headers().get('X-AppFrame-Access-Token') as string;

    const res = await fetch(`${process.env.URL_PROJECT_ADMIN_API}/api/access-token/`, {
    method: 'GET',
    headers: { 'X-AppFrame-Access-Token': accessToken}
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
  } catch (e) {
    let message = 'Error fetch project access token';

    if (e instanceof Error) {
      message = e.message;
    }

    return {error: message};
  }
}