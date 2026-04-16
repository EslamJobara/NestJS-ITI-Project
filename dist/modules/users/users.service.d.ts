import { Repository } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    create(email: string, passwordHash: string, role?: UserRole): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User>;
    updateHashedRefreshToken(userId: number, hashedRefreshToken: string | null): Promise<void>;
}
