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
  setSubmenuItems: (items: SubmenuItem[]) => void;
  clearSubmenuItems: () => void;
};

const SubmenuContext = createContext<SubmenuContextValue | undefined>(
  undefined
);

export const SubmenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [submenuItems, updateItems] = useState<SubmenuItem[]>([]);

  const setSubmenuItems = useCallback((newItems: SubmenuItem[]) => {
    updateItems(newItems);
  }, []);

  const clearSubmenuItems = useCallback(() => {
    updateItems([]);
  }, []);

  const value = useMemo(
    () => ({ submenuItems, setSubmenuItems, clearSubmenuItems }),
    [submenuItems, setSubmenuItems, clearSubmenuItems]
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
