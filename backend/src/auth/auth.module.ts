import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
            }),
        }),
        JwtModule.registerAsync({
            useFactory: async () => {
                const options: JwtModuleOptions = {
                    privateKey: process.env.JWT_PRIVATE_KEY,
                    publicKey: process.env.JWT_PUBLIC_KEY,
                    signOptions: {
                        algorithm: 'RS256',
                        expiresIn: '1800s',
                    }
                };
                return options;
            }
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}