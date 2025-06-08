import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(walletAddress: string): Promise<User>;
    createOrUpdate(userData: Partial<User>): Promise<User>;
}
