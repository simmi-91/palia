//import { LINKS } from "../../app/shared/LINKS.ts";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type LINKS_Entry = {
  site: string;
  url: string;
  logo: string;
  description: string | null;
};

const fetchLinks = async (): Promise<LINKS_Entry[]> => {
  console.log(import.meta.env.VITE_API_URL);
  const response = await fetch(import.meta.env.VITE_API_URL + "/links");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: { links: LINKS_Entry[] } = await response.json();
  return data.links;
};

export const selectAllLinks = (): UseQueryResult<LINKS_Entry[], Error> => {
  const linkObj = useQuery({
    queryKey: ["linksData"],
    queryFn: fetchLinks,
    staleTime: 1000 * 60 * 5,
  });
  return linkObj;
};
