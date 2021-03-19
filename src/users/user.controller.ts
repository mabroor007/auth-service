import { Router } from "express";
import { UserServiceResponse } from "./user.dto";
import UserService from "./user.service";
import UsersValidator from "./user.validator";

const UserRouter = Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    // Validating Payload
    const validationRes = UsersValidator.validateAll(req.body);
    if (!validationRes.success)
      return res.json(
        new UserServiceResponse(false, "Invalid Request", validationRes.payload)
      );

    const result: UserServiceResponse = await UserService.createUser(req.body);
    res.json(result);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json(new UserServiceResponse(false, "Error has occured!", e));
  }
});

UserRouter.delete("/:id", async (req, res) => {
  try {
    const validation = await UsersValidator.validateId(req.params.id, true);
    if (!validation.success)
      return res.json(
        new UserServiceResponse(false, "Invalid Id!", validation.payload)
      );

    const result = await UserService.removeUser({ id: req.params.id });

    return res.json(
      new UserServiceResponse(true, "Successfully deleted User!", result)
    );
  } catch (e) {
    res
      .status(500)
      .json(new UserServiceResponse(false, "Error has occured!", e));
  }
});

UserRouter.get("/", async (_, res) => {
  try {
    const result = await UserService.getAllUsers();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, e });
  }
});

UserRouter.get("/details/:id", async (req, res) => {
  try {
    const result = await UserService.getDetailsOfUser({ id: req.params.id });
    res.json(result);
  } catch (e) {}
  res.json({ created: true, user: null });
});

export default UserRouter;
