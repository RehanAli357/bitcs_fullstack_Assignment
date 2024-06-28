import { SetMetadata } from '@nestjs/common';
import { ERole } from '../admin.service';

export const ROLES_KEY = 'roles';
export const roleGaurd = (...roles: ERole[]) => SetMetadata(ROLES_KEY, roles);