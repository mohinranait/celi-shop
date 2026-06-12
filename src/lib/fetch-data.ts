
import { API_BASE_URL } from "./envSecret";

type FetchConfig = {
  api: string;
  locale?: string;
  revalidate?: number;
};

export async function fetchData<T>(
  config: FetchConfig,
  retry = 1
): Promise<T | null> {
  const apiPath = `${API_BASE_URL}/${config.api}`;

  try {

    const res = await fetch(apiPath, {
      next: {
        revalidate: config.revalidate ?? 3000,
      },
    });


    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    if (retry > 0) {
      console.log(`Retrying API: ${apiPath}`);
      return fetchData<T>(config, retry - 1);
    }

    console.error(`FINAL FAIL: ${apiPath}`, error);
    return null;
  }
}