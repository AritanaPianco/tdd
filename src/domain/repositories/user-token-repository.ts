export interface UserTokenRepository {
  updateAccessToken(userId: string, token: string): Promise<void>;
}
