import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  /*
  @UseGuards(AuthGuard(), AdminGuard)
  @Post('promote')
  async promote(@Body() {userId}) {
    return await this.usersService.promote(userId);
  }
  */
}
