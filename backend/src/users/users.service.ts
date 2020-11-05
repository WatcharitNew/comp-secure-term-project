import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto } from './users.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ _id: string }> {
    const createdUser = new this.userModel(createUserDto);
    createdUser.save();
    return { _id: createdUser._id };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ _id: string }> {
    return { _id: (await this.userModel.findOne(loginUserDto).exec())._id };
  }
}
