import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { FavoriteItem } from "../../app/types/userTypes";

const fetchFavorites = async (profileId: string): Promise<FavoriteItem[]> => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/favorites/${profileId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: FavoriteItem[] = await response.json();
  return data;
};

export const selectAllFavorites = (
  profileId: string | null
): UseQueryResult<FavoriteItem[], Error> => {
  const query = useQuery({
    queryKey: ["FavoritesData", profileId],
    queryFn: () => fetchFavorites(profileId as string),
    enabled: Boolean(profileId),
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectFavoritesByCategory = (
  profileId: string | null,
  category: string
): UseQueryResult<FavoriteItem[], Error> => {
  return useQuery({
    queryKey: ["FavoritesData", profileId, category],
    queryFn: () => fetchFavorites(profileId as string),
    enabled: Boolean(profileId),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.filter((item) => item.category === category),
  });
};

export const addFavorite = async (
  profileId: string,
  category: string,
  itemId: number
) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/favorites/${profileId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, itemId }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add favorite");
  }
  return response.json();
};

export const removeFavorite = async (profileId: string, favoriteId: number) => {
  const response = await fetch(
    import.meta.env.VITE_API_URL + `/favorites/${profileId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favoriteId }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to remove favorite");
  }
  return response.json();
};
