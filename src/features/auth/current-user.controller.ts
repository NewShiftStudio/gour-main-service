import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ClientsService } from '../client/client.service';
import { CurrentUserService } from './current-user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';

@ApiTags('current-user')
@Controller('client-auth/current-user')
export class CurrentUserController {
  constructor(
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

  @MessagePattern('change-email')
  changeEmail(
    @Payload('id') id: number,
    @Payload('hashedCode') hashedCode: string,
    @Payload('dto') dto: ChangeEmailDto,
  ) {
    return this.currentUserService.changeEmail(id, hashedCode, dto);
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

  @MessagePattern('change-avatar')
  changeAvatar(
    @Payload('clientId') clientId: number,
    @Payload('avatarId') avatarId: number,
  ) {
    return this.currentUserService.changeAvatarId(clientId, avatarId);
  }
}
