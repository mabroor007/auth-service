export class CreateUserPayload {
  name: string;
  userName: string;
  email: string;
  phone: string;
  imgUrl: string;
  password: string;
  dateOfBirth: Date;
}

export class FindUserByIdPayload {
  id: string;
}

export class FindUserByUserNamePayload {
  userName: string;
}

export class LoginUserByEmailPayload {
  email: string;
  password: string;
}

export class RemoveUserPayload {
  id: string;
}

export class UserServiceResponse {
  constructor(
    readonly success: boolean,
    readonly message: string,
    readonly payload: any
  ) {}
}
