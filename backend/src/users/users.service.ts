import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto, HasUserDto } from './users.dto';
import { User } from '../schemas/user.schema';

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
  ): Promise<{ _id: string } | HasUserDto> {
    const { userName, displayName } = createUserDto;
    const result = await this.hasUser(userName, displayName);
    if (result.hasDisplayName || result.hasUserName) {
      return result;
    }
    const createdUser = new this.userModel(createUserDto);
    createdUser.save();
    return { _id: createdUser._id };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ _id: string }> {
    const user = await this.userModel.findOne(loginUserDto).exec();
    if (!user) {
      console.log('not found user');
      return { _id: null };
    }
    return { _id: user._id };
  }
}
