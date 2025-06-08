export declare class AuthService {
    verifyWalletSignature(walletAddress: string, signature: string, message: string): Promise<boolean>;
}
