import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SubmenuItem = { label: string; href: string };

type SubmenuContextValue = {
  submenuItems: SubmenuItem[];
  setItems: (items: SubmenuItem[]) => void;
  clearItems: () => void;
};

const SubmenuContext = createContext<SubmenuContextValue | undefined>(
  undefined
);

export const SubmenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [submenuItems, updateItems] = useState<SubmenuItem[]>([]);

  const setItems = useCallback((newItems: SubmenuItem[]) => {
    updateItems(newItems);
  }, []);

  const clearItems = useCallback(() => {
    updateItems([]);
  }, []);

  const value = useMemo(
    () => ({ submenuItems, setItems, clearItems }),
    [submenuItems, setItems, clearItems]
  );

  return (
    <SubmenuContext.Provider value={value}>{children}</SubmenuContext.Provider>
  );
};

export function useSubmenu() {
  const ctx = useContext(SubmenuContext);
  if (!ctx) throw new Error("useSubmenu must be used within SubmenuProvider");
  return ctx;
}
