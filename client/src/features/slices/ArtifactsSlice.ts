import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ARTIFACT_Entry } from "../../app/types/types";

const fetchArtifacts = async (): Promise<ARTIFACT_Entry[]> => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/artifacts");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ARTIFACT_Entry[] = await response.json();
  return data;
};

export const selectAllArtifacts = (): UseQueryResult<
  ARTIFACT_Entry[],
  Error
> => {
  const query = useQuery({
    queryKey: ["ArtifactsData"],
    queryFn: fetchArtifacts,
    staleTime: 1000 * 60 * 5,
  });
  return query;
};
