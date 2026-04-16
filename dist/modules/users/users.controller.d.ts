import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: JwtPayload): Promise<{
        id: number;
        email: string;
        role: import("../../common/enums/user-role.enum").UserRole;
        createdAt: Date;
    }>;
}
