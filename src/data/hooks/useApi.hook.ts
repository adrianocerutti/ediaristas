import { AxiosRequestConfig } from 'axios';
import { ApiService } from 'data/services/ApiService';
import useSWR from 'swr';

export default function useApi<OutputType>(
    EndPoint: string | null,
    config?: AxiosRequestConfig
): { data: OutputType | undefined; error: Error } {
    const { data, error } = useSWR<OutputType>(EndPoint, async (url) => {
        const response = await ApiService(url, config);

        return response.data;
    });

    return { data, error };
}
