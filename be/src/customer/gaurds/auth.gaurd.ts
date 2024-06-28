import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CustomerService } from '../customer.service';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from './roles.decorator';
import { response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      try {
        const user = await this.customerService.validateToken(
          token.split(' ')[1],
        );
        if (user) {
          request.user = user;
        }
        
        const hasRole = this.checkRole(user, context);
        if (hasRole) {
          return true;
        } else {
          throw new UnauthorizedException('Insufficient permissions');
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    throw new UnauthorizedException(
      'Authorization header missing or malformed',
    );
  }

  private checkRole(user, context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles && requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new HttpException(
        { message: 'Forbidden Access', status: 403 },
        403,
      );
    }
  }
}
