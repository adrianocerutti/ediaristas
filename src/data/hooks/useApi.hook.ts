import { ApiLinksInterface } from './../@types/ApiLinksInterface';
import { AxiosRequestConfig } from 'axios';
import { ApiService, ApiServiceHateoas } from 'data/services/ApiService';
import useSWR, {mutate} from 'swr';
import { useEffect, useCallback } from 'react';

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

export function useApiHateoas<OutputType>(
    links: ApiLinksInterface[] = [],
    name: string | null,
    config?: AxiosRequestConfig
): { data: OutputType | undefined; error: Error } {
    const makeRequest = useCallback(() => {
        return new Promise<OutputType>((resolve) => {
            ApiServiceHateoas(links, name || '', async (request) => {
                const response = await request<OutputType>(config);
                resolve(response.data);
            });
        });
    }, [links, name, config]);

    const { data, error } = useSWR<OutputType>(name, makeRequest);

    useEffect(() => {
        mutate(name, makeRequest);
    }, [links, name, makeRequest]);

    

    return { data, error };
}