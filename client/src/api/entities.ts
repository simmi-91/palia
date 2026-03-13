import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { EntityOption } from "../app/types/entityTypes";

const BASE_URL = (entityType: string) =>
  import.meta.env.VITE_API_URL + `/entity/${entityType}`;

const fetchEntities = async (entityType: string): Promise<EntityOption[]> => {
  const response = await fetch(BASE_URL(entityType));
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const useLocationEntities = (): UseQueryResult<EntityOption[], Error> =>
  useQuery({
    queryKey: ["EntityData", "location"],
    queryFn: () => fetchEntities("location_entity"),
    staleTime: 1000 * 60 * 5,
  });

export const useNeededForEntities = (): UseQueryResult<EntityOption[], Error> =>
  useQuery({
    queryKey: ["EntityData", "neededFor"],
    queryFn: () => fetchEntities("needed_for_entity"),
    staleTime: 1000 * 60 * 5,
  });

export const useHowToObtainEntities = (): UseQueryResult<EntityOption[], Error> =>
  useQuery({
    queryKey: ["EntityData", "howToObtain"],
    queryFn: () => fetchEntities("how_to_obtain_entity"),
    staleTime: 1000 * 60 * 5,
  });

const entityQueryKey = (entityType: string) => {
  if (entityType === "location_entity") return ["EntityData", "location"];
  if (entityType === "needed_for_entity") return ["EntityData", "neededFor"];
  return ["EntityData", "howToObtain"];
};

export const useAddEntity = (entityType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newItem: Omit<EntityOption, "id">) =>
      fetch(BASE_URL(entityType), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newItem }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityQueryKey(entityType) }),
  });
};

export const useUpdateEntity = (entityType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newItem }: { id: number; newItem: Omit<EntityOption, "id"> }) =>
      fetch(BASE_URL(entityType), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newItem }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityQueryKey(entityType) }),
  });
};

export const useDeleteEntity = (entityType: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetch(BASE_URL(entityType), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityQueryKey(entityType) }),
  });
};
