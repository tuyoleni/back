import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class AuthService {
  async verifyWalletSignature(walletAddress: string, signature: string, message: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }
} 