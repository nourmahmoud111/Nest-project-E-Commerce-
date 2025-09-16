import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/utils/enums";

// Custom decorator to attach roles metadata to route handlers
export const Roles=(...roles:UserType[] )=> SetMetadata('roles',roles)