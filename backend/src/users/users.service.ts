import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, HasUserDto } from './users.dto';
import { User } from '../schemas/user.schema';
import bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async hasUser(userName: string, displayName: string): Promise<HasUserDto> {
    let user = await this.userModel.findOne({ displayName }).exec();
    const result = { hasUserName: false, hasDisplayName: false };
    if (user) {
      result.hasDisplayName = true;
    }
    user = await this.userModel.findOne({ userName }).exec();
    if (user) {
      result.hasUserName = true;
    }
    return result;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<
    { _id: string; displayName: string; access_token: string } | HasUserDto
  > {
    const { userName, displayName } = createUserDto;
    const result = await this.hasUser(userName, displayName);
    if (result.hasDisplayName || result.hasUserName) {
      return result;
    }
    const hashedPass = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPass;
    createUserDto.isAdmin = false;
    const createdUser = new this.userModel(createUserDto);
    createdUser.save();

    const payload = { sub: createdUser._id, userName };
    const access_token = this.jwtService.sign(payload, {
      algorithm: 'RS256',
      secret: process.env.JWT_PRIVATE_KEY,
    });
    return { _id: createdUser._id, displayName, access_token };
  }

  async getUserByUsername(userName: string) {
    const user = await this.userModel.findOne({ userName }).exec();
    return user;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) throw new BadRequestException('Not found any User');
    return user.isAdmin;
  }

  /*
  async promote(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { isAdmin: true }
    );
  }
  */

  async getDisplayNameByUserId(userId: string): Promise<string> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) throw new BadRequestException('Not found any User');
    return user.displayName;
  }
}
