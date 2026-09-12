import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {retry: 1, staleTime: 5000},
  },
});

export const clearSessionQueries = async () => {
  await queryClient.cancelQueries();
  queryClient.clear();
};
