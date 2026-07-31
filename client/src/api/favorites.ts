import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { AuthContextType, FavoriteItem } from "../app/types/userTypes";
import { useAuth } from "../context/AuthContext";

type AuthFetch = AuthContextType["makeAuthenticatedRequest"];

const fetchFavorites = async (
  authFetch: AuthFetch,
  profileId: string
): Promise<FavoriteItem[]> => {
  const response = await authFetch(
    import.meta.env.VITE_API_URL + `/favorites/${profileId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: FavoriteItem[] = await response.json();
  return data;
};

export const selectAllFavorites = (
  profileId: string
): UseQueryResult<FavoriteItem[], Error> => {
  const { makeAuthenticatedRequest } = useAuth();
  const query = useQuery({
    queryKey: ["FavoritesData", profileId],
    queryFn: () => fetchFavorites(makeAuthenticatedRequest, profileId),
    enabled: Boolean(profileId),
    staleTime: 1000 * 60 * 5,
  });
  return query;
};

export const selectFavoritesByCategory = (
  profileId: string,
  category: string
): UseQueryResult<FavoriteItem[], Error> => {
  const { makeAuthenticatedRequest } = useAuth();
  return useQuery({
    queryKey: ["FavoritesData", profileId, category],
    queryFn: () => fetchFavorites(makeAuthenticatedRequest, profileId),
    enabled: Boolean(profileId),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.filter((item) => item.category === category),
  });
};

export const addFavorite = async (
  authFetch: AuthFetch,
  profileId: string,
  category: string,
  itemId: number
) => {
  const response = await authFetch(
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

export const removeFavorite = async (
  authFetch: AuthFetch,
  profileId: string,
  favoriteId: number
) => {
  const response = await authFetch(
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
