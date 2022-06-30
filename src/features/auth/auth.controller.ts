import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response, Request } from 'express';
import { CurrentUser } from './current-user.decorator';
import { Client } from '../../entity/Client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientsService } from '../client/client.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export interface AppRequest extends Request {
  user?: Client;
  token?: string;
}

@ApiTags('client-auth')
@Controller('client-auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post('/sendCode')
  sendCode(@Body() dto: SendCodeDto) {
    this.authService.sendCode(dto.phone);
    return {
      result: true,
    };
  }

  @Post('/signup')
  signup(@Body() dto: object) {
    return this.authService.signup(dto as SignUpDto);
  }

  @Post('/signin')
  async signin(
    @Body() dto: SignInDto,
    @Res() res: Response,
    @Req() req: AppRequest,
  ) {
    const { token, client } = await this.authService.signin(dto);
    res.cookie('AccessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    req.user = client;
    req.token = token;

    return res.send({
      token,
    });
  }

  @Post('/signout')
  async signout(@Res() res: Response) {
    res.clearCookie('AccessToken');

    // req.user = undefined;
    // req.token = undefined;

    return res.send('User was successfully logged out');
  }
}
