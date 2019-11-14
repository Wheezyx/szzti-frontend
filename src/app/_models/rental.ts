import { Item } from '@app/_models/item';
import {Place} from '@app/_models/place';
import {Renter} from '@app/_models/renter'

export class Rental {
    item: Item;
    place: Place;
    renter: Renter;
}