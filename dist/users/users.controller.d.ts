import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOne(walletAddress: string): Promise<User>;
    createOrUpdate(userData: Partial<User>): Promise<User>;
}
