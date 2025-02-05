import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserResponse } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<UserResponse | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user && (password === user.password)) {
            const { password, ...result } = user; // Excluir la contraseña del resultado
            return result;
        }
        return null;
    }

    async login(user: UserResponse) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload), // Generar el token
            user
        };
    }
}
