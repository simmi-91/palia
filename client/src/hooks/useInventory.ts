import { useState, useCallback } from "react";
import type { GoogleProfile, UserInventoryItem } from "../app/types/userTypes"; // Adjust path

// Utility function (can be moved to a utils file if used elsewhere)
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
};

// Function for the actual DB call (not exported, for internal use only)
const callApiUpdate = async (
  profileId: string,
  category: string,
  itemId: number,
  amount: number
) => {
  try {
    await fetch(import.meta.env.VITE_API_URL + "/inventory/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, category, itemId, amount }),
    });
  } catch (error) {
    console.error("Failed to update inventory on DB:", error);
    // In a real app, you would handle a persistent error state here
  }
};

export const useInventory = (profile: GoogleProfile | null) => {
  const [inventory, setInventory] = useState<UserInventoryItem[] | null>(null);

  // Use a stable profile ID for the debounced function dependency
  const profileId = profile?.id;

  // Debounced API Update function
  const debouncedApiUpdate = useCallback(
    debounce((...args: Parameters<typeof callApiUpdate>) => {
      // Check for profile ID here to ensure we don't call the API if logged out
      if (profileId) {
        callApiUpdate(
          profileId,
          ...(args.slice(1) as [string, number, number])
        );
      }
    }, 500),
    [profileId] // Re-create if profileId changes (user logs in/out)
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

  const updateInventoryAmount = (
    category: string,
    itemId: number,
    newAmount: number
  ) => {
    setInventory((prevInventory) => {
      if (!prevInventory) return null;
      const existingIndex = prevInventory.findIndex(
        (item) => item.itemId === itemId && item.category === category
      );

      const newInventory =
        existingIndex > -1
          ? prevInventory.map((item, index) =>
              index === existingIndex ? { ...item, amount: newAmount } : item
            )
          : newAmount > 0
            ? [...prevInventory, { itemId, category, amount: newAmount }]
            : prevInventory;

      return newInventory.filter((item) => item.amount > 0);
    });

    // Pass the profile ID as the first argument, which the debounced function expects.
    if (profileId) {
      debouncedApiUpdate(profileId, category, itemId, newAmount);
    }
  };

  return {
    inventory,
    loadInventory,
    updateInventoryAmount,
  };
};
