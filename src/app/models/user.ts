import { Role } from './role';

export class User {
    username: string;
    roles: Array<Role>
    token?: string;
}