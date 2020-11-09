export class CreateUserDto {
  readonly userName: string;
  password: string;
  readonly displayName: string;
}

export class HasUserDto {
  readonly hasUserName: boolean;
  readonly hasDisplayName: boolean;
}
