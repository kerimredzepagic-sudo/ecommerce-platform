import { IUser, AuthProvider } from '../models';

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isActive: boolean;
  isVerified: boolean;
  provider: AuthProvider;
  profileCompleted: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

export function toUserDTO(user: IUser): UserDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    phone: user.phone,
    address: user.address,
    isActive: user.isActive,
    isVerified: user.isVerified,
    provider: user.provider,
    profileCompleted: user.profileCompleted,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toAuthResponseDTO(
  user: IUser,
  accessToken: string,
  refreshToken: string
): AuthResponseDTO {
  return {
    user: toUserDTO(user),
    accessToken,
    refreshToken,
  };
}
