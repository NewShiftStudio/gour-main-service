import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';

@Injectable()
export class CookieService {
  ACCESS_TOKEN_NAME = 'AccessToken';
  REFRESH_TOKEN_NAME = 'RefreshToken';
  NEW_DATE = new Date();
  MAX_AGE_15_MIN = new Date(
    this.NEW_DATE.setMinutes(this.NEW_DATE.getMinutes() + 15),
  );
  MAX_AGE_30_DAYS = new Date(
    this.NEW_DATE.setMinutes(this.NEW_DATE.getDay() + 30),
  );
  sameSite: CookieOptions['sameSite'] =
    process.env.NODE_ENV === 'production' ? 'lax' : 'none';

  get accessTokenOptions() {
    return {
      httpOnly: true,
      secure: true,
      expires: this.MAX_AGE_15_MIN,
      sameSite: this.sameSite,
    };
  }

  get refreshTokenOptions() {
    return {
      httpOnly: true,
      secure: true,
      path: '/client-auth/refresh',
      expires: this.MAX_AGE_30_DAYS,
      sameSite: this.sameSite,
    };
  }

  clearAllTokens(res: Response) {
    res.clearCookie(this.ACCESS_TOKEN_NAME, this.accessTokenOptions);
    res.clearCookie(this.REFRESH_TOKEN_NAME, this.refreshTokenOptions);
  }
}
