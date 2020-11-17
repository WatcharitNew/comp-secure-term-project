import { Controller, Post, UseGuards, Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from 'src/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@LoadUser() user, @Response() res) {
    const { access_token, displayName, isAdmin} =  await this.authService.login(user);
    res.cookie('Authentication', access_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    });
    res.status(201);
    return res.send({displayName, isAdmin});
  }
}
