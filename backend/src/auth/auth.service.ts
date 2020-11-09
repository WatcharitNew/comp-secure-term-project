import {
    Injectable,
    UnauthorizedException,
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
        if (!user) {
            throw new UnauthorizedException(`Invalid username`);
        }
        if (await bcrypt.compare(password, user.password)) {
            user.userName = userName;
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user._id, userName: user.userName };
        return {
            access_token: this.jwtService.sign(payload),
            _id: user._id,
            displayName: user.displayName,
        };
    }
}