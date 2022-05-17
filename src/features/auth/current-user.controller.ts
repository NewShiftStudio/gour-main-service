import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { Client } from '../../entity/Client';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { ClientsService } from '../client/client.service';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { decodePhoneCode, encodePhoneCode } from './jwt.service';
import { Response, Request } from 'express';
import { SendCodeDto } from './dto/send-code.dto';

const PHONE_CODE_KEY = 'PhoneCode';

@ApiTags('current-user')
@Controller('client-auth/currentUser')
export class CurrentUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
  ) {}
  @ApiBearerAuth()
  @Get('/')
  getCurrentUser(@CurrentUser() currentUser: Client) {
    return currentUser;
  }

  @ApiBearerAuth()
  @Put('/')
  updateCurrentUser(
    @CurrentUser() currentUser: Client,
    @Body() dto: UpdateUserDto,
  ) {
    return this.clientsService.update(currentUser.id, dto);
  }

  @ApiBearerAuth()
  @Put('/')
  changePassword(
    @CurrentUser() currentUser: Client,
    @Body() dto: UpdateUserDto,
  ) {
    return this.clientsService.update(currentUser.id, dto);
  }

  @ApiBearerAuth()
  @Post('/phone/sendCode')
  async sendCode(
    @CurrentUser() currentUser: Client,
    @Body() dto: SendCodeDto,
    @Res() res: Response,
  ) {
    const code = await this.authService.sendCode(dto.phone);
    const hashedCode = encodePhoneCode(dto.phone, code);
    res.cookie(PHONE_CODE_KEY, hashedCode, {
      // path: '/auth/currentUser/phone/change',
    });

    return res.send({
      result: 'Code successfully sent',
    });
  }

  @ApiBearerAuth()
  @Post('/phone/change')
  async changePhone(
    @CurrentUser() currentUser: Client,
    @Body() dto: ChangePhoneDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hashedCode = req.cookies[PHONE_CODE_KEY];

    if (!hashedCode) {
      throw new HttpException('Cookie code was not found', 400);
    }
    const { code, phone } = decodePhoneCode(hashedCode || '');

    if (phone !== dto.phone) {
      throw new HttpException('Wrong phone', 400);
    }
    res.cookie(PHONE_CODE_KEY, '');

    console.log('code', code, dto.code);
    console.log('phone', phone, dto.phone);

    if (+code !== dto.code) {
      throw new HttpException('Wrong code, please, try again', 400);
    }

    await this.clientsService.updatePhone(currentUser.id, dto.phone);
    return res.send({
      result: true,
    });
  }
}
