import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys.js';
import { packageService } from '../../../services/packageService.js';

export function usePackage(packageId) {
  return useQuery({
    queryKey: queryKeys.packages.detail(packageId),
    queryFn: () => packageService.getPackageById(packageId),
    enabled: Boolean(packageId)
  });
}

export function useSavePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pkg => packageService.savePackage(pkg),
    onSuccess: saved => {
      queryClient.setQueryData(queryKeys.packages.detail(saved.id), saved);
      queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
    }
  });
}

export function useCreatePackageFromTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: templateId => packageService.createPackage(templateId),
    onSuccess: saved => {
      queryClient.setQueryData(queryKeys.packages.detail(saved.id), saved);
      queryClient.invalidateQueries({ queryKey: queryKeys.packages.all });
    }
  });
}
