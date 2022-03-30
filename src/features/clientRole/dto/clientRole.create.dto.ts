import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientRoleCreateDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  key: string;
}
