import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class VerifyWalletDto {
  walletAddress: string;
  signature: string;
  message: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyWallet(@Body() verifyWalletDto: VerifyWalletDto) {
    const isValid = await this.authService.verifyWalletSignature(
      verifyWalletDto.walletAddress,
      verifyWalletDto.signature,
      verifyWalletDto.message,
    );

    return { isValid };
  }
} 