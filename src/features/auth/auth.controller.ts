import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { decodeToken, encodeJwt, encodeRefreshJwt } from './jwt.service';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Client } from 'src/entity/Client';
import { CheckCodeDto } from './dto/check-code.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

export interface AppRequest extends Request {
  user?: Client;
  token?: string;
}

@ApiTags('client-auth')
@Controller('client-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('send-email-code')
  sendCode(@Payload() dto: SendCodeDto) {
    return this.authService.sendCode(dto.email);
  }

  @MessagePattern('check-code')
  checkCode(@Payload() dto: CheckCodeDto) {
    return this.authService.checkCode(dto.code, dto.hashedCode);
  }

  @MessagePattern('signup')
  signup(@Payload() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @MessagePattern('recover-password')
  recoverPassword(@Payload() dto: RecoverPasswordDto) {
    return this.authService.recoverPassword(dto);
  }

  @MessagePattern('signin')
  signin(@Payload() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() token: string) {
    const user = decodeToken(token) as { id: number };

    if (!user) throw new UnauthorizedException();

    const payload = {
      id: user?.id,
    };

    const accessToken = encodeJwt(payload);
    const refreshToken = encodeRefreshJwt(payload);

    return { accessToken, refreshToken };
  }
}
