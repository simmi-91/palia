import { useState, useCallback } from "react";
import type { GoogleProfile, UserInventoryItem } from "../app/types/userTypes";
import { debounce } from "../utils/debounce";

const callApiUpdate = async (
  profileId: string,
  category: string,
  itemId: number,
  amount: number
) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + "/inventory/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, category, itemId, amount }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update inventory on DB:", error);
    return { success: false, count: 0, error: error };
  }
};

const callApiBulkUpdate = async (
  profileId: string,
  items: Array<{ category: string; itemId: number; amount: number }>
): Promise<{ success: boolean; count?: number; error?: any }> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/inventory/bulk-update",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, items }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to bulk update inventory on DB:", error);
    return { success: false, count: 0, error: error };
  }
};

export const useInventory = (profile: GoogleProfile | null) => {
  const [inventory, setInventory] = useState<UserInventoryItem[]>([]);
  const profileId = profile?.id;

  const debouncedApiUpdate = useCallback(
    debounce((...args: Parameters<typeof callApiUpdate>) => {
      if (profileId) {
        callApiUpdate(
          profileId,
          ...(args.slice(1) as [string, number, number])
        );
      }
    }, 500),
    [profileId]
  );

  const loadInventory = useCallback(async () => {
    if (!profileId) return;
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/inventory/${profileId}`
      );
      const data: UserInventoryItem[] = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setInventory([]);
    }
  }, [profileId]);

  const updateInventoryAmount = ({
    category,
    itemId,
    amount,
  }: UserInventoryItem) => {
    setInventory((prevInventory) => {
      if (!prevInventory) return [];
      const existingIndex = prevInventory.findIndex(
        (item) => item.itemId === itemId && item.category === category
      );

      const newInventory =
        existingIndex > -1
          ? prevInventory.map((item, index) =>
              index === existingIndex ? { ...item, amount: amount } : item
            )
          : amount > 0
            ? [...prevInventory, { itemId, category, amount }]
            : prevInventory;

      return newInventory.filter((item) => item.amount > 0);
    });

    if (profileId) {
      debouncedApiUpdate(profileId, category, itemId, amount);
    }
  };

  const bulkUpdateInventory = useCallback(
    async (items: UserInventoryItem[]) => {
      if (!profileId) return { success: false, count: 0 };
      const result = await callApiBulkUpdate(profileId, items);
      if (result.success) {
        await loadInventory();
      }
      return result;
    },
    [profileId, loadInventory]
  );

  return {
    inventory,
    loadInventory,
    updateInventoryAmount,
    bulkUpdateInventory,
  };
};
