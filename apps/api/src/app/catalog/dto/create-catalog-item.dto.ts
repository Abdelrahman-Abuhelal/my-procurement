import { Type } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateCatalogItemDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  category: string;

  @Type(() => Number)
  @IsNumber()
  price: number;
}
