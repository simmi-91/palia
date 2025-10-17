import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FavoriteItem } from "../app/types/userTypes";
import { addFavorite, removeFavorite } from "../features/slices/FavoritesSlice";

type RemoveArgs = { favoriteId: number };
type AddArgs = { category: string; itemId: number };

export function useRemoveFavorite(profileId: string | null) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ favoriteId }: RemoveArgs) =>
      removeFavorite(profileId as string, favoriteId),
    onMutate: async ({ favoriteId }) => {
      await queryClient.cancelQueries({
        queryKey: ["FavoritesData", profileId],
      });
      const previous = queryClient.getQueryData<FavoriteItem[]>([
        "FavoritesData",
        profileId,
      ]);
      if (previous) {
        queryClient.setQueryData<FavoriteItem[]>(
          ["FavoritesData", profileId],
          (prev) => (prev ?? []).filter((f) => f.favoriteId !== favoriteId)
        );
      }
      return { previous } as { previous?: FavoriteItem[] };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["FavoritesData", profileId],
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["FavoritesData", profileId] });
    },
  });

  return { remove: mutate, isPending };
}

export function useAddFavorite(profileId: string | null) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ category, itemId }: AddArgs) =>
      addFavorite(profileId as string, category, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["FavoritesData", profileId] });
    },
  });

  return { add: mutate, isPending };
}
