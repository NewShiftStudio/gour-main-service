import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ClientService } from '../client/client.service';
import { CurrentUserService } from './current-user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@ApiTags('current-user')
@Controller('client-auth/current-user')
export class CurrentUserController {
  constructor(
    private readonly clientService: ClientService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @MessagePattern('get-current-user')
  getCurrentUser(@Payload() id: string) {
    return this.currentUserService.getUser(id);
  }

  @MessagePattern('edit-current-user')
  updateCurrentUser(
    @Payload('id') id: string,
    @Payload('dto') dto: UpdateUserDto,
  ) {
    return this.currentUserService.updateCurrentUser(id, dto);
  }

  @MessagePattern('change-email')
  changeEmail(
    @Payload('id') id: string,
    @Payload('hashedCode') hashedCode: string,
    @Payload('dto') dto: ChangeEmailDto,
  ) {
    return this.currentUserService.changeEmail(id, hashedCode, dto);
  }

  @MessagePattern('change-password')
  changePassword(
    @Payload('id') id: string,
    @Payload('dto') dto: ChangePasswordDto,
  ) {
    return this.currentUserService.changePassword(id, dto);
  }

  @MessagePattern('reduce-game-live')
  reduceGameLive(@Payload('id') id: string) {
    return this.currentUserService.reduceGameLive(id);
  }

  @MessagePattern('get-favorites')
  getFavoritesProducts(@Payload() id: string) {
    return this.clientService.getFavorites(id);
  }

  @MessagePattern('add-to-favorites')
  addProductToFavorites(
    @Payload('clientId') clientId: string,
    @Payload('productId') productId: number,
  ) {
    return this.clientService.addToFavorites(clientId, productId);
  }

  @MessagePattern('remove-from-favorites')
  removeProductFromFavorites(
    @Payload('clientId') clientId: string,
    @Payload('productId') productId: number,
  ) {
    return this.clientService.removeFromFavorites(clientId, productId);
  }

  @MessagePattern('change-city')
  changeCity(
    @Payload('clientId') clientId: string,
    @Payload('cityId') cityId: number,
  ) {
    return this.currentUserService.changeCityId(clientId, cityId);
  }

  @MessagePattern('change-avatar')
  changeAvatar(
    @Payload('clientId') clientId: string,
    @Payload('avatarId') avatarId?: number,
  ) {
    return this.currentUserService.changeAvatarId(clientId, avatarId);
  }

  @MessagePattern('change-main-address')
  changeMainProfile(
    @Payload('clientId') clientId: string,
    @Payload('addressId') addressId: number | null,
  ) {
    return this.currentUserService.changeMainProfileId(clientId, addressId);
  }
}
