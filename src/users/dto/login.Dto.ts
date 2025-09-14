import { IsEmail, IsNotEmpty,  IsString,   MaxLength, MinLength,  } from "class-validator"

export class loginDto {
@IsEmail()
@IsNotEmpty()
@MaxLength(250)
email :string

@IsString()
@IsNotEmpty()
@MinLength(6)
password :string

}
