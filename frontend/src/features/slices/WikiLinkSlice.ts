import { LINKS } from "../../app/shared/LINKS.ts";

export type LINKS_Entry = {
  site: string;
  url: string;
  logo: string;
  description: string | null;
};
export const selectAllLinks = (): LINKS_Entry[] => {
  return LINKS;
};
