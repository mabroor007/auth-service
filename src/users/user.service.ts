import {
  CreateUserPayload,
  FindUserByIdPayload,
  UserServiceResponse,
  RemoveUserPayload,
} from "./user.dto";
import UserEntity from "./user.entity";

const UserService = {
  async createUser(payload: CreateUserPayload): Promise<UserServiceResponse> {
    const user = UserEntity.create(payload);
    const savedUser = await user.save();
    return new UserServiceResponse(true, "User Created Successfully", {
      ...savedUser,
      password: undefined,
    });
  },

  async getDetailsOfUser(
    payload: FindUserByIdPayload
  ): Promise<UserServiceResponse> {
    const user = await UserEntity.findOne({ id: payload.id });
    if (!user) return new UserServiceResponse(false, "User Not Found!", null);
    return new UserServiceResponse(true, "User Found", {
      ...user,
      password: undefined,
    });
  },

  async getAllUsers(): Promise<UserServiceResponse> {
    const users = await UserEntity.find();
    if (users.length == 0)
      return new UserServiceResponse(false, "No Users Found!", null);
    return new UserServiceResponse(true, "Users Found", users);
  },

  async removeUser(payload: RemoveUserPayload): Promise<UserServiceResponse> {
    const user = await UserEntity.findOne({ id: payload.id });
    if (user) {
      await UserEntity.remove(user);
      return new UserServiceResponse(true, "User Removed Successfully!", null);
    }
    return new UserServiceResponse(false, "User Not found", null);
  },
};

export default UserService;
