import { Result } from 'oxide.ts';
import { UpdateProfileResponseDto } from './update-profile.dto';

export type UpdateProfileSuccess = UpdateProfileResponseDto;
export type UpdateProfileFailure = Array<any>;
export type UpdateProfileResult = Result<
  UpdateProfileSuccess,
  UpdateProfileFailure
>;
