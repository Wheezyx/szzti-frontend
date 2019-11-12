import { ItemType } from './item-type';
import { InsideType } from './inside-type';
export class Item {
  id: String;
  fullItemName: String;
  dateOfDelivery: String;
  description: String;
  equipment: boolean;
  genericName: String;
  insideType: InsideType;
  inventoryCode: String;
  itemType: ItemType;
  placeOfPosting: String;
}
