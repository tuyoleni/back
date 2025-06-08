import { AuthService } from './auth.service';
declare class VerifyWalletDto {
    walletAddress: string;
    signature: string;
    message: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    verifyWallet(verifyWalletDto: VerifyWalletDto): Promise<{
        isValid: boolean;
    }>;
}
export {};
