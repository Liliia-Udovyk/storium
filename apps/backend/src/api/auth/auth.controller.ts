import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { GoogleUserDto } from './dto/google-user.dto';
import { JwtAuthGuard } from '../../services/jwt/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redirect to Google OAuth' })
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback handler' })
  @ApiResponse({
    status: 302,
    description: 'Redirect after successful Google OAuth login',
  })
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.handleGoogleCallback(req.user as GoogleUserDto, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user from JWT' })
  @ApiResponse({
    status: 200,
    description: 'Current authenticated user info',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: 'User Name',
      },
    },
  })
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and clear auth cookie' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    schema: {
      example: { message: 'Logged out successfully' },
    },
  })
  logout(@Req() req: Request, @Res() res: Response) {
    this.authService.logout(res);
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
