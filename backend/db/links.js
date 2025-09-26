import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const file = "links.json";
const defaultData = {
  links: [],
};

const adapter = new JSONFile(file);
const dbLinks = new Low(adapter, defaultData);

export default dbLinks;
