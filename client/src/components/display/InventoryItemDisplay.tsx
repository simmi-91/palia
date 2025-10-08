import React from "react";
import missingImg from "../../assets/images/missing.png";
import { useItemDetails } from "../../hooks/useItemDetails";
import { type CombinedInventoryItem } from "../../app/types/userTypes";

interface InventoryItemDisplayProps {
  item: CombinedInventoryItem;
}

const InventoryItemDisplay: React.FC<InventoryItemDisplayProps> = ({
  item,
}) => {
  const { itemObject, isItemLoading } = useItemDetails(
    item.category,
    item.itemId
  );

  return (
    <div key={item.itemId} className="col-6 col-md-3 col-xl-2">
      {isItemLoading ? (
        "Loading..."
      ) : (
        <>
          {itemObject?.image ? (
            <img
              src={`https://palia.wiki.gg${itemObject.image}`}
              style={{ maxHeight: "100px", maxWidth: "100%" }}
            />
          ) : (
            <img
              src={missingImg}
              style={{ maxHeight: "100px", maxWidth: "100%" }}
            />
          )}
          <div>{itemObject?.name || "Unknown Item"}</div>
          <div>For trade: {item.amount}</div>
        </>
      )}
    </div>
  );
};

export default InventoryItemDisplay;
