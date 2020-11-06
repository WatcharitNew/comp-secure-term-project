export class CreateUserDto {
  readonly userName: string;
  readonly password: string;
  readonly displayName: string;
}

export class LoginUserDto {
  readonly userName: string;
  readonly password: string;
}

export class HasUserDto {
  readonly hasUserName: boolean;
  readonly hasDisplayName: boolean;
}
