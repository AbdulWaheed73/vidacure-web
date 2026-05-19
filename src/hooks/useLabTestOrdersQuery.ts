import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { labTestService } from '@/services/labTestService';

export const useLabTestOrdersQuery = () => {
  return useQuery({
    queryKey: queryKeys.labTestOrders,
    queryFn: () => labTestService.getOrders(),
  });
};
