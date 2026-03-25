import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { SignInDto, SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    const token = this.generateToken(newUser._id.toString());
    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString());
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  private generateToken(userId: string) {
    return this.jwtService.sign({ userId });
  }
}
