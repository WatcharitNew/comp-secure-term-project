import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, HasUserDto } from './users.dto';
import { User } from '../schemas/user.schema';
import bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
  ): Promise<{ _id: string, displayName: string } | HasUserDto> {
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
    return { _id: createdUser._id,  displayName};
  }

  async getUserByUsername(userName: string) {
    const user = await this.userModel.findOne({ userName }).exec();
    return user;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    return user.isAdmin;
  }

  async promote(userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { isAdmin: true }
    );
  }
}
