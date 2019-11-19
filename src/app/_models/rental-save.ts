import { Place } from '@app/_models/place';
import { Renter } from '@app/_models/renter';
import { Item } from './item';
export class RentalSave {
    items: Item[];
    renter: Renter;
    place: Place;
}