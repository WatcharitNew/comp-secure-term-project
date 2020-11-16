import { Body, Controller, Post, Response } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Response() res) {
    const result:any = await this.usersService.create(createUserDto);
    if(!result._id) {
      res.status(400);
      return res.send(result);
    }
    const {_id, displayName, access_token} = result;
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    });
    res.status(201);
    return res.send({_id, displayName});
  }

  /*
  @UseGuards(AuthGuard(), AdminGuard)
  @Post('promote')
  async promote(@Body() {userId}) {
    return await this.usersService.promote(userId);
  }
  */
}
