import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/api/queryKeys.js';
import * as templateService from '../../../services/templateService.js';

export function useFolders() {
  return useQuery({
    queryKey: queryKeys.folders.all,
    queryFn: () => templateService.getAllFolders()
  });
}

export function useUserTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.user,
    queryFn: () => templateService.getUserTemplates()
  });
}

export function useDefaultTemplates() {
  return templateService.getDefaultTemplates();
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: templateId => templateService.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.user });
    }
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: data => templateService.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
    }
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, updates }) => templateService.updateFolder(folderId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
    }
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: folderId => templateService.deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.user });
    }
  });
}
