import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Credit card number (must pass Luhn check)',
    example: '4242424242424242',
  })
  @IsCreditCard()
  number!: string;

  @ApiProperty({ description: 'Card security code', example: '123' })
  @IsNumberString()
  @Length(3, 4)
  cvc!: string;

  @ApiProperty({ description: 'Expiration month (01-12)', example: '08' })
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'expMonth must be between 01 and 12',
  })
  expMonth!: string;

  @ApiProperty({ description: 'Expiration year (two digits)', example: '28' })
  @IsNumberString()
  @Length(2, 2)
  expYear!: string;

  @ApiProperty({ description: 'Cardholder name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  cardHolder!: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Product to buy',
    example: 'e95a0aab-d9db-4490-a939-34934d88efde',
  })
  @IsUUID()
  productId!: string;

  @ApiProperty({ description: 'Units to buy', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Customer email for the payment receipt',
    example: 'customer@example.com',
  })
  @IsEmail()
  customerEmail!: string;

  @ApiPropertyOptional({
    description: 'Number of installments (defaults to 1)',
    example: 1,
    minimum: 1,
    maximum: 36,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(36)
  installments?: number;

  @ApiProperty({ description: 'Credit card data', type: CardDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => CardDto)
  card!: CardDto;
}
