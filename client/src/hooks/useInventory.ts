import { useState, useCallback } from "react";
import type { GoogleProfile, InventoryItem } from "../app/types/userTypes";
import { debounce } from "../utils/debounce";

const callApiUpdate = async (
  token: string,
  profileId: string,
  category: string,
  itemId: number,
  amount: number
) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + "/inventory/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
  token: string,
  profileId: string,
  items: Array<{ category: string; itemId: number; amount: number }>
): Promise<{ success: boolean; count?: number; error?: any }> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/inventory/bulk-update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

export const useInventory = (
  profile: GoogleProfile | null,
  token: string | undefined
) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const profileId = profile?.id;

  const debouncedApiUpdate = useCallback(
    debounce((...args: Parameters<typeof callApiUpdate>) => {
      if (profileId && token) {
        callApiUpdate(
          token,
          profileId,
          ...(args.slice(2) as [string, number, number])
        );
      }
    }, 500),
    [profileId, token]
  );

  const loadInventory = useCallback(async () => {
    if (!profileId || !token) return;
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/inventory/${profileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        console.error("Failed to load inventory:", response.status);
        setInventory([]);
        return;
      }
      const data: InventoryItem[] = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setInventory([]);
    }
  }, [profileId, token]);

  const updateInventoryAmount = ({
    category,
    itemId,
    amount,
  }: InventoryItem) => {
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

    if (profileId && token) {
      debouncedApiUpdate(token, profileId, category, itemId, amount);
    }
  };

  const bulkUpdateInventory = useCallback(
    async (items: InventoryItem[]) => {
      if (!profileId || !token) return { success: false, count: 0 };
      const result = await callApiBulkUpdate(token, profileId, items);
      if (result.success) {
        await loadInventory();
      }
      return result;
    },
    [profileId, token, loadInventory]
  );

  return {
    inventory,
    loadInventory,
    updateInventoryAmount,
    bulkUpdateInventory,
  };
};
