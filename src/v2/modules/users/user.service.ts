import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { GlobalEvents } from '@constants';
import { USERS_ROLE } from './constants';
import { UserCreatedEvent } from './events';
import type {
  CreateAdminDto,
  CreateMemberDto,
  CreateShipperDto,
  CreateStaffDto,
  ShipperGetAllDto,
  UpdateUserDto,
} from './dto';
import { UserRepository } from './user.repository';
import { plainToInstance } from 'class-transformer';
import { ShipperGetAllRO } from './ro';

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
    return this.userRepository.findAllByRole(USERS_ROLE.STAFF);
  }

  async createMember(dto: CreateMemberDto) {
    const { fullName, password, username, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      role: USERS_ROLE.MEMBER,
      username,
      fullName,
      phone,
      password: hashed,
    });

    this.eventEmitter.emit(
      GlobalEvents.USER.CREATED,
      new UserCreatedEvent({ userId: user.id }),
    );

    return user;
  }

  async createAdmin(dto: CreateAdminDto) {
    const { username, fullName, password, email, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    return this.userRepository.create({
      role: USERS_ROLE.ADMIN,
      username,
      fullName,
      email,
      phone,
      password: hashed,
    });
  }

  async getAllShippers(dto: ShipperGetAllDto) {
    const response = await this.userRepository.getShippers(dto);

    return plainToInstance(ShipperGetAllRO, response, {
      excludeExtraneousValues: true,
    });
  }

  getOne(id: string) {
    return this.userRepository.findOneById(id);
  }

  async createStaff(dto: CreateStaffDto) {
    const { username, fullName, password, email, phone } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      role: USERS_ROLE.STAFF,
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
      role: USERS_ROLE.SHIPPER,
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

  async countDailyMember() {
    return this.userRepository.countDailyMember();
  }

  async countMonthlyMember() {
    return this.userRepository.countMonthlyMember();
  }

  async countWeeklyMember() {
    return this.userRepository.countWeeklyMember();
  }
}
