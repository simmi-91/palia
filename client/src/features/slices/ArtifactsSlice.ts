import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ArtifactEntry } from "../../app/types/wikiTypes";

const fetchArtifacts = async (): Promise<ArtifactEntry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/artifacts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ArtifactEntry[] = await response.json();
  return data;
};

export const selectAllArtifacts = (): UseQueryResult<
  ArtifactEntry[],
  Error
> => {
  const query = useQuery({
    queryKey: ["ArtifactsData"],
    queryFn: fetchArtifacts,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectArtifactById = (
  itemId: number
): UseQueryResult<ArtifactEntry | undefined, Error> => {
  return useQuery({
    queryKey: ["ArtifactsData"],
    queryFn: fetchArtifacts,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.find((item) => item.id === itemId),
  });
};
