import { IsNotEmpty,  IsOptional,  IsString, Length, MinLength,  } from "class-validator"

export class UpdateUserDto {

@IsString()
@IsNotEmpty()
@MinLength(6)
@IsOptional()
password? :string


@IsString()
@Length(2,150)
@IsOptional()
username? :string
}
