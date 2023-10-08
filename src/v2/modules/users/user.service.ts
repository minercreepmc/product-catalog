import { Injectable } from '@nestjs/common';
import { UserRole } from './constants';
import {
  CreateAdminDto,
  CreateMemberDto,
  CreateShipperDto,
  CreateStaffDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GlobalEvents } from '@constants';
import { UserCreatedEvent } from './events';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getAllStaff() {
    return this.userRepository.findAllByRole(UserRole.STAFF);
  }

  async createMember(dto: CreateMemberDto) {
    const { fullName, password, username, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await this.userRepository.create({
        role: UserRole.MEMBER,
        username,
        fullName,
        phone,
        password: hashed,
      });

      this.eventEmitter.emit(
        GlobalEvents.USER.MEMBER_CREATED,
        new UserCreatedEvent({ userId: user.id }),
      );

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(dto: CreateAdminDto) {
    const { username, fullName, password, email, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    return this.userRepository.create({
      role: UserRole.ADMIN,
      username,
      fullName,
      email,
      phone,
      password: hashed,
    });
  }

  getAllShippers() {
    return this.userRepository.findAllByRole(UserRole.SHIPPER);
  }

  getOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  async createStaff(dto: CreateStaffDto) {
    const { username, fullName, password, email, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      role: UserRole.STAFF,
      username,
      fullName: fullName ? fullName : undefined,
      password: hashed,
      email,
      phone,
    });

    user!.hashed = undefined;
    return user;
  }

  async createShipper(dto: CreateShipperDto) {
    const { username, fullName, password, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      role: UserRole.SHIPPER,
      username,
      fullName: fullName ? fullName : undefined,
      password: hashed,
      phone,
    });

    user!.hashed = undefined;
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { fullName, password, email, phone } = dto;
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await this.userRepository.updateOneById(id, {
      fullName,
      password: hashed,
      email,
      phone,
    });

    user!.hashed = undefined;
    return user;
  }
}
