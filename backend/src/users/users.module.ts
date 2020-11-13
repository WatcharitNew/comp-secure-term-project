import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
            }
        };
        return options;
      },
  }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
