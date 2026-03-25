import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
