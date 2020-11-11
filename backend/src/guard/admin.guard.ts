import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const reqUserId = request.user.userId;
        const isAdmin = await this.userService.isAdmin(reqUserId);
        return isAdmin;
    }
}