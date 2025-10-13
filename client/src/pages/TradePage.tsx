import { selectAllTradeable } from "../features/slices/TradableSlice";
import { selectAllArtifacts } from "../features/slices/ArtifactsSlice";
import { selectAllPlushies } from "../features/slices/PlushiesSlice";

import type {
  UserInventoryItem,
  GoogleProfile,
  RawTradeItem,
  TradeDisplayItem,
} from "../app/types/userTypes";
import InventoryItemDisplay from "../components/display/InventoryItemDisplay";

type GroupedUserInventory = {
  [category: string]: UserInventoryItem[];
};
type GroupedTradeInventory = {
  [category: string]: TradeDisplayItem[];
};

const groupTradeOffers = (
  rawTradeInventory: RawTradeItem[] | null
): GroupedTradeInventory => {
  if (!rawTradeInventory) return {};

  const acc: GroupedTradeInventory = {};

  rawTradeInventory.forEach((item) => {
    if (item.amount <= 0) return;
    const { category, itemId, amount, userName } = item;

    if (!acc[category]) {
      acc[category] = [];
    }

    let existingItem = acc[category].find(
      (grouped) => grouped.itemId === itemId
    );

    if (existingItem) {
      existingItem.amount += amount;
      if (!existingItem.offeringUsers.includes(userName)) {
        existingItem.offeringUsers.push(userName);
      }
    } else {
      acc[category].push({
        category: category,
        itemId: itemId,
        amount: amount,
        offeringUsers: [userName],
      } as TradeDisplayItem);
    }
  });
  return acc;
};

const groupInventoryByCategory = (
  inventory: UserInventoryItem[] | null
): GroupedUserInventory => {
  if (!inventory) return {};

  return inventory.reduce((acc, item) => {
    if (item.amount <= 0) return acc;

    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);

    return acc;
  }, {} as GroupedUserInventory);
};

const listInventory = (
  inventory: GroupedUserInventory | GroupedTradeInventory | null,
  isTradeColumn: boolean,
  userInventory: GroupedUserInventory | null
) => {
  if (!inventory) return <div className="col">null</div>;

  const userHasItem = (category: string, itemId: number): boolean => {
    if (!userInventory || !userInventory[category]) return false;
    return userInventory[category].some(
      (userItem) => userItem.itemId === itemId && userItem.amount > 0
    );
  };
  console.log(inventory);

  return (
    <div className="col">
      {Object.keys(inventory).map((category) => {
        const filteredItems = inventory[category].filter(
          (item) => item.amount > 1
        );
        if (filteredItems.length === 0) return null;

        return (
          <div key={category} className="">
            <h4 className="text-capitalize">{category}</h4>
            <div className="row g-1 py-2 d-flex flex-wrap justify-content-center">
              {filteredItems.map((item) => {
                const displayItem = item as TradeDisplayItem;
                let offeringUsers = isTradeColumn
                  ? displayItem.offeringUsers || []
                  : [];

                let opacity = 1;
                if (isTradeColumn) {
                  if (userHasItem(displayItem.category, displayItem.itemId)) {
                    opacity = 0.5;
                  }
                }

                return (
                  <InventoryItemDisplay
                    key={item.itemId}
                    item={displayItem}
                    opacity={opacity}
                    offeringUsers={offeringUsers}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TradePage = ({
  profile,
  inventory,
}: {
  profile: GoogleProfile;
  inventory: UserInventoryItem[];
}) => {
  const {
    data: tradeableInventory,
    isLoading: loadingTradeData,
    isError,
    error,
  } = selectAllTradeable(profile.id);
  const { isLoading: loadingArtifacts } = selectAllArtifacts();
  const { isLoading: loadingPlushies } = selectAllPlushies();

  if (loadingTradeData || loadingArtifacts || loadingPlushies) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div>Loading trade data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center my-3">
        <div className="text-danger">Error loading data: {error.message}</div>
      </div>
    );
  }

  const groupedUserInventory = groupInventoryByCategory(inventory);

  const groupedTradeInventory = groupTradeOffers(
    (tradeableInventory as RawTradeItem[]) || null
  );

  if (Object.keys(groupedUserInventory).length === 0) {
    return (
      <div className="alert alert-info text-center">
        <p>
          <b>You don't have any items in your inventory to trade yet.</b>
        </p>
        <p>You need atleast 2 of an item to be able to trade away 1</p>
      </div>
    );
  }

  return (
    <div className="container-fluid text-center">
      <div className="row">
        <h2>Trading Post</h2>
      </div>

      <div className="row">
        <div className="col  border-end ">
          <h3 className="border-bottom">I have:</h3>
          <div className="row">
            {listInventory(groupedUserInventory, false, null)}
          </div>
        </div>

        <div className="col text-center">
          <h3 className="border-bottom">Others have:</h3>
          <div className="row">
            {Object.keys(groupedTradeInventory).length > 0 ? (
              listInventory(groupedTradeInventory, true, groupedUserInventory)
            ) : (
              <div>There are no other users with registered items</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TradePage;
