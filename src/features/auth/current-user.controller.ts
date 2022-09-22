import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ClientsService } from '../client/client.service';
import { CurrentUserService } from './current-user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { encodePhoneCode } from './jwt.service';

@ApiTags('current-user')
@Controller('client-auth/current-user')
export class CurrentUserController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientsService: ClientsService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @MessagePattern('get-current-user')
  getCurrentUser(@Payload() id: number) {
    return this.currentUserService.getUser(id);
  }

  @MessagePattern('edit-current-user')
  updateCurrentUser(
    @Payload('id') id: number,
    @Payload('dto') dto: UpdateUserDto,
  ) {
    return this.currentUserService.updateCurrentUser(id, dto);
  }

  @MessagePattern('send-phone-code')
  async sendCode(@Payload() dto: SendCodeDto) {
    const code = await this.authService.sendCode(dto.phone);
    const hashedCode = encodePhoneCode(dto.phone, +code);

    return hashedCode;
  }

  @MessagePattern('change-phone')
  changePhone(
    @Payload('id') id: number,
    @Payload('hashedCode') hashedCode: string,
    @Payload('dto') dto: ChangePhoneDto,
  ) {
    return this.currentUserService.changePhone(id, hashedCode, dto);
  }

  @MessagePattern('change-password')
  changePassword(
    @Payload('id') id: number,
    @Payload('dto') dto: ChangePasswordDto,
  ) {
    return this.currentUserService.changePassword(id, dto);
  }

  @MessagePattern('get-favorites')
  getFavoritesProducts(@Payload() id: number) {
    return this.clientsService.getFavorites(id);
  }

  @MessagePattern('add-to-favorites')
  addProductToFavorites(
    @Payload('clientId') clientId: number,
    @Payload('productId') productId: number,
  ) {
    return this.clientsService.addToFavorites(clientId, productId);
  }

  @MessagePattern('remove-from-favorites')
  removeProductFromFavorites(
    @Payload('clientId') clientId: number,
    @Payload('productId') productId: number,
  ) {
    return this.clientsService.removeFromFavorites(clientId, productId);
  }

  @MessagePattern('change-city')
  changeCity(
    @Payload('clientId') clientId: number,
    @Payload('cityId') cityId: number,
  ) {
    return this.currentUserService.changeCityId(clientId, cityId);
  }

  @MessagePattern('change-main-address')
  changeMainProfile(
    @Payload('clientId') clientId: number,
    @Payload('addressId') addressId: number | null,
  ) {
    return this.currentUserService.changeMainProfileId(clientId, addressId);
  }
}
