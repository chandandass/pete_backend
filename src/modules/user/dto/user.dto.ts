export class SignUpDto {
  name: string;
  email: string;
  password: string;
  kids: KidDto[];
}

export class LoginDto {
  public email: string;
  public password: string;
}

export class UpdateDetailsDto {
  public name: string;
  public relation: string;
  public email: string;
}

export class UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export class AuthResponse {
  constructor(
    public message: string,
    public token: string,
  ) {}
}

export class UpdateUserResponse {
  constructor(
    public message: string,
    public user: {
      name: string;
      email: string;
      relation: string;
    },
  ) {}
}

export class ActionResponse {
  constructor(public message: string) {}
}

//shared
export class KidDto {
  name: string;
  dateOfBirth: string;
  gender: string;
}
