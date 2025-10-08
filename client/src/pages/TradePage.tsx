import { selectAllTradeable } from "../features/slices/TradableSlice";
import { selectAllArtifacts } from "../features/slices/ArtifactsSlice";
import { selectAllPlushies } from "../features/slices/PlushiesSlice";

import type {
  UserInventoryItem,
  GoogleProfile,
  CombinedInventoryItem,
} from "../app/types/userTypes";
import InventoryItemDisplay from "../components/display/InventoryItemDisplay";

type GroupedInventory = {
  [category: string]: CombinedInventoryItem[];
};

const groupInventoryByCategory = (
  inventory: CombinedInventoryItem[] | null
): GroupedInventory => {
  if (!inventory) return {};

  return inventory.reduce((acc, item) => {
    if (item.amount <= 1) return acc;

    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {} as GroupedInventory);
};

const listInventory = (inventory: GroupedInventory | null) => {
  if (!inventory) return <div className="col">null</div>;
  return (
    <div className="col border m-1">
      {Object.keys(inventory).map((category) => (
        <div key={category} className="">
          <h3 className="text-capitalize">{category}</h3>
          <div className="row d-flex flex-wrap">
            {inventory[category].map((item) => (
              <InventoryItemDisplay key={item.itemId} item={item} />
            ))}
          </div>
        </div>
      ))}
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

  const groupedTradeInventory = groupInventoryByCategory(
    tradeableInventory || null
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Trading Post</h2>
      </div>
      <div className="row">
        <div className="col text-center">
          <h3>I have:</h3>
          <div className="row">{listInventory(groupedUserInventory)}</div>
        </div>

        <div className="col text-center">
          <h3>Others have:</h3>
          <div className="row">{listInventory(groupedTradeInventory)}</div>
        </div>
      </div>

      {Object.keys(groupedUserInventory).length === 0 && (
        <div className="alert alert-info">
          You don't have any items in your inventory to trade yet.
        </div>
      )}
    </div>
  );
};
export default TradePage;
