import React from "react";
import missingImg from "../../assets/images/missing.png";
import { useItemDetails } from "../../hooks/useItemDetails";
import { type TradeDisplayItem } from "../../app/types/userTypes";

type InventoryItemDisplayProps = {
  item: TradeDisplayItem;
  opacity?: number;
  offeringUsers: string[] | [];
};

const InventoryItemDisplay: React.FC<InventoryItemDisplayProps> = ({
  item,
  opacity,
  offeringUsers,
}) => {
  const { itemObject, isItemLoading } = useItemDetails(
    item.category,
    item.itemId
  );
  const amount = item.amount - 1;
  if (amount === 0) {
    return;
  }

  let numOpacity = 1;
  if (opacity && opacity != 1) {
    numOpacity = opacity;
  }

  const objectName = itemObject?.name || "Unknown Item";

  const userCount = offeringUsers ? offeringUsers.length : 0;
  const userListTitle =
    userCount > 0
      ? "Users: " + offeringUsers.join(", ")
      : "No users offering this item";

  return (
    <div key={item.itemId} className="col-6 col-md-3 col-lg-3 col-xxl-2 d-flex">
      <div
        className="rounded border border-dark"
        style={{
          opacity: numOpacity,
          background:
            "linear-gradient(180deg,rgba(226, 229, 233, 1) 0%, rgba(226, 229, 233, 0.9) 40%, rgba(59, 59, 59, 0.5) 100%",
        }}
      >
        {isItemLoading ? (
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <div className="position-relative">
              <b className="p">{objectName}</b>
            </div>
            <div className="position-relative">
              {userCount > 0 && (
                <div
                  title={userListTitle}
                  className="position-absolute top-50 start-70 border border-dark bg-info rounded-circle overflow-hidden
                "
                  style={{ height: "30px", width: "30px" }}
                >
                  {userCount}
                </div>
              )}
            </div>
            {itemObject?.image ? (
              <img
                src={itemObject.image}
                style={{ maxHeight: "100px", maxWidth: "100%" }}
              />
            ) : (
              <img
                src={missingImg}
                style={{ maxHeight: "100px", maxWidth: "100%" }}
              />
            )}
            <div>For trade: {amount}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryItemDisplay;
