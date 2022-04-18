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

@ApiTags('auth')
@Controller('auth')
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
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
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
    });

    req.user = client;
    req.token = token;

    return res.send({
      token,
    });
  }

  @ApiBearerAuth()
  @Get('/currentUser')
  getCurrentUser(@CurrentUser() currentUser: Client) {
    console.log('currentUser', currentUser);
    return currentUser;
  }

  @ApiBearerAuth()
  @Put('/currentUser')
  updateCurrentUser(
    @CurrentUser() currentUser: Client,
    @Body() dto: UpdateUserDto,
  ) {
    return this.clientsService.update(currentUser.id, dto);
  }
}
