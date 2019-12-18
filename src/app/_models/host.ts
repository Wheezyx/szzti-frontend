import { ConnectionInterface } from './connection-interface';
export class Host {
    id: string;
    name: string;
    place: string;
    inventoryCode: string;
    connectionInterfaces: ConnectionInterface[];
}