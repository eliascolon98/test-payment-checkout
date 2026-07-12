import { Type } from 'class-transformer';
import {
  IsCreditCard,
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CardDto {
  @IsCreditCard()
  number!: string;

  @IsNumberString()
  @Length(3, 4)
  cvc!: string;

  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'expMonth must be between 01 and 12',
  })
  expMonth!: string;

  @IsNumberString()
  @Length(2, 2)
  expYear!: string;

  @IsString()
  @IsNotEmpty()
  cardHolder!: string;
}

export class CreatePaymentDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(36)
  installments?: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => CardDto)
  card!: CardDto;
}
