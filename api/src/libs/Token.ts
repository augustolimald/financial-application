import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken';

class Token {
  private secret: string;

  constructor() {
    this.secret = process.env.API_KEY || 'financial_application';
  }

  public generate(data: any, options: SignOptions): string {
    return sign(JSON.stringify(data), this.secret, options);
  }

  public validate(token: string): JwtPayload {
    return verify(token, this.secret) as JwtPayload;
  }
}

export default new Token();
