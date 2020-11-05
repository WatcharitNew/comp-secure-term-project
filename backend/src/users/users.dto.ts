export class CreateUserDto {
  readonly userName: string;
  readonly password: string;
  readonly displayName: string;
}

export class LoginUserDto {
  readonly userName: string;
  readonly password: string;
}
