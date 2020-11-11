export class CreateUserDto {
  readonly userName: string;
  password: string;
  readonly displayName: string;
  isAdmin?: boolean;
}

export class HasUserDto {
  readonly hasUserName: boolean;
  readonly hasDisplayName: boolean;
}
