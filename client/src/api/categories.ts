import { useQuery, useMutation, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { Category } from "../app/types/wikiTypes";

const QUERYKEY = "CategoryData";
const BASE_URL = () => import.meta.env.VITE_API_URL + "/categories";

const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch(BASE_URL());
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
};

export const selectAllCategories = (): UseQueryResult<Category[], Error> =>
    useQuery({
        queryKey: [QUERYKEY],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 5,
    });

export const useAddCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCategory: Category) =>
            fetch(`${BASE_URL()}/${newCategory.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newCategory }),
            }).then((r) => r.json()),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERYKEY] }),
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (category: Category) =>
            fetch(`${BASE_URL()}/${category.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newCategory: category }),
            }).then((r) => r.json()),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERYKEY] }),
    });
};

export const usePatchCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            fetch(`${BASE_URL()}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).then((r) => r.json()),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERYKEY] }),
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            fetch(`${BASE_URL()}/${id}`, { method: "DELETE" }).then((r) => r.json()),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERYKEY] }),
    });
};
