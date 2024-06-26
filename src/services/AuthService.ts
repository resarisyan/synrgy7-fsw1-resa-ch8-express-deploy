import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { TokenRepository } from '../repositories/TokenRepository.js';
import TYPES from '../di/types.js';
import {
  GoogleLoginRequest,
  LoginUserRequest,
  RegisterUserRequest,
  UserRequest
} from '../dtos/request/user-request.js';
import { UserResponse } from '../dtos/response/user-response.js';
import { Validation } from '../validators/index.js';
import { UserValidation } from '../validators/user-validation.js';
import bcrypt from 'bcrypt';
import { ResponseError } from '../handlers/response-error.js';
import { OAuth2Client } from 'google-auth-library';

@injectable()
export class AuthService {
  private userRepository: UserRepository;
  private tokenRepository: TokenRepository;
  constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository,
    @inject(TYPES.TokenRepository) tokenRepository: TokenRepository
  ) {
    this.tokenRepository = tokenRepository;
    this.userRepository = userRepository;
  }

  public async login(req: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, req);
    const user = await this.userRepository.findOne({
      username: loginRequest.username
    });

    if (!(await bcrypt.compare(loginRequest.password, user.password))) {
      throw new ResponseError(401, 'Invalid username or password');
    }

    const jwtToken = jwt.sign(
      { id: user.id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const dataToken = await this.tokenRepository.insert('token:' + jwtToken, {
      user_id: user.id,
      token: jwtToken,
      expires_at: new Date(Date.now() + 86400000)
    });

    return {
      username: user.username,
      name: user.name,
      role: user.role,
      token: dataToken.token
    };
  }

  public async loginGoogle(req: GoogleLoginRequest): Promise<UserResponse> {
    const googleLoginRequest = Validation.validate(
      UserValidation.GOOGLE_LOGIN,
      req
    );
    const oauth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
    const ticket = await oauth.verifyIdToken({
      idToken: googleLoginRequest.credential,
      audience: oauth._clientId
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new ResponseError(400, 'Invalid token');
    }

    const user = await this.userRepository.findByEmail(payload.email as string);
    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const jwtToken = jwt.sign(
      { id: user.id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    const dataToken = await this.tokenRepository.insert('token:' + jwtToken, {
      user_id: user.id,
      token: jwtToken,
      expires_at: new Date(Date.now() + 86400000)
    });

    return {
      username: user.username,
      name: user.name,
      role: user.role,
      token: dataToken.token
    };
  }

  public async register(req: RegisterUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(UserValidation.REGISTER, req);
    const user = await this.userRepository.findByUsername(
      registerRequest.username
    );
    if (user) {
      throw new ResponseError(400, 'Username already exists');
    }

    const email = await this.userRepository.findByEmail(registerRequest.email);
    if (email) {
      throw new ResponseError(400, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerRequest.password, 10);
    const dataUser = await this.userRepository.insert({
      name: registerRequest.name,
      username: registerRequest.username,
      email: registerRequest.email,
      password: hashedPassword
    });

    return {
      username: dataUser.username,
      name: dataUser.name
    };
  }

  public async registerGoogle(req: GoogleLoginRequest): Promise<UserResponse> {
    const googleLoginRequest = Validation.validate(
      UserValidation.GOOGLE_LOGIN,
      req
    );
    const oauth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
    const ticket = await oauth.verifyIdToken({
      idToken: googleLoginRequest.credential,
      audience: oauth._clientId
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new ResponseError(400, 'Invalid token');
    }

    const user = await this.userRepository.findByEmail(payload.email as string);
    if (user) {
      throw new ResponseError(400, 'User already exists');
    }

    const dataUser = await this.userRepository.insert({
      name: payload.name as string,
      email: payload.email as string
    });

    return {
      username: dataUser.username,
      name: dataUser.name
    };
  }

  public async getUser(token: string): Promise<UserResponse> {
    const tokenData = await this.tokenRepository.find('token:' + token);
    if (!tokenData) {
      throw new ResponseError(401, 'Invalid token');
    }

    if (tokenData.expires_at < new Date()) {
      await this.tokenRepository.delete('token:' + token);
      throw new ResponseError(401, 'Token expired');
    }
    const user = await this.userRepository.findOne({ id: tokenData.user_id });
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      token: tokenData.token,
      role: user.role
    };
  }

  public async logout(token: string): Promise<void> {
    await this.tokenRepository.delete('token:' + token);
  }

  public async me(req: UserRequest): Promise<UserResponse> {
    return {
      username: req.user?.username as string,
      name: req.user?.name as string,
      role: req.user?.role
    };
  }
}
