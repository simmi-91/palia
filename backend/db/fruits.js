import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const file = "db.json";
const defaultData = { fruits: ["apple", "pear"] };

const adapter = new JSONFile(file);
const dbFruits = new Low(adapter, defaultData);

export default dbFruits;
