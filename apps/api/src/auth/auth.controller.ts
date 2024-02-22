import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshGuard } from './guards/refresh.guard';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  // TODO: To implement an endpoint with JWT authentication (and use req.user),
  // TODO: you need to use the @UseGuards decorator with the JwtGuard class.

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    return this.authService.refresh(req.user as User);
  }
}
