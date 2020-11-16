import {
    Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(userName: string, password: string) {
        const user = await this.userService.getUserByUsername(userName);
        if (!user) return null;
        if (await bcrypt.compare(password, user.password)) {
            user.userName = userName;
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user._id, userName: user.userName };
        const access_token = this.jwtService.sign(payload, {algorithm: 'RS256', secret: process.env.JWT_PRIVATE_KEY});
        return {
            access_token: access_token,
            displayName: user.displayName,
            isAdmin: await this.userService.isAdmin(user._id),
        }
    }
}