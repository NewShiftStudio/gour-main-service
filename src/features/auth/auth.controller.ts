import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { SendCodeDto } from './dto/send-code.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response, Request } from 'express';
import { Client } from '../../entity/Client';
import { ApiTags } from '@nestjs/swagger';
import { CookieService } from './cookie.service';
import { decodeToken, encodeJwt, encodeRefreshJwt } from './jwt.service';

export interface AppRequest extends Request {
  user?: Client;
  token?: string;
}

@ApiTags('client-auth')
@Controller('client-auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
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
    try {
      const { token, client, refreshToken } = await this.authService.signin(
        dto,
      );

      res.cookie(
        this.cookieService.ACCESS_TOKEN_NAME,
        token,
        this.cookieService.accessTokenOptions,
      );
      res.cookie(
        this.cookieService.REFRESH_TOKEN_NAME,
        refreshToken,
        this.cookieService.refreshTokenOptions,
      );

      req.user = client;
      req.token = token;

      return res.status(200).json({
        token,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  @Post('/signout')
  async signout(@Res() res: Response) {
    this.cookieService.clearAllTokens(res);

    return res.status(200).json({
      message: 'User logged out',
    });
  }

  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const user = decodeToken(
      req.cookies[this.cookieService.REFRESH_TOKEN_NAME],
    ) as { id: number };
    const payload = {
      id: user.id,
    };
    if (!user) {
      throw new UnauthorizedException();
    }

    const token = encodeJwt(payload);
    const refreshToken = encodeRefreshJwt(payload);

    res.cookie(
      this.cookieService.ACCESS_TOKEN_NAME,
      token,
      this.cookieService.accessTokenOptions,
    );
    res.cookie(
      this.cookieService.REFRESH_TOKEN_NAME,
      refreshToken,
      this.cookieService.refreshTokenOptions,
    );

    return res.status(200).json({
      message: 'Refresh success',
    });
  }
}
