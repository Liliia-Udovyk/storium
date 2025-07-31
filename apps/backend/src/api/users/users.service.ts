import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/services/typeorm/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(userData: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      user = this.usersRepository.create(userData);
      await this.usersRepository.save(user);
    }

    return user;
  }
}
