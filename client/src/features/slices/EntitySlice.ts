import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { EntityOption } from "../../app/types/entityTypes";

const fetchEntities = async (entityType: string): Promise<EntityOption[]> => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/entity/${entityType}`
  );
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
