import { IsEmail, IsNotEmpty,  IsOptional,  IsString, Length,  MaxLength, MinLength,  } from "class-validator"

export class RegisterDto {
@IsEmail()
@IsNotEmpty()
@MaxLength(250)
email :string

@IsString()
@IsNotEmpty()
@MinLength(6)
password :string


@IsString()
@Length(2,150)
@IsOptional()
username :string
}
