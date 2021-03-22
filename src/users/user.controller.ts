import { Router } from "express";
import { UserServiceResponse } from "./user.dto";
import UserService from "./user.service";
import UsersValidator from "./user.validator";
import { setJwtToken, publicKey } from "./user.token";
import { getUserMiddleware } from "./user.middleware";

const UserRouter = Router();

UserRouter.post("/signup", async (req, res) => {
  try {
    // Validating Payload
    const validationRes = await UsersValidator.signUpValidator(req.body);
    if (!validationRes.success)
      return res.json(
        new UserServiceResponse(false, "Invalid Request", validationRes.payload)
      );

    const result: UserServiceResponse = await UserService.createUser(req.body);

    setJwtToken(res, result.payload);

    res.json(result);
  } catch (e) {
    res
      .status(500)
      .json(new UserServiceResponse(false, "Error has occured!", e));
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    // Validating Payload
    const validationRes = UsersValidator.loginValidator(req.body);
    if (!validationRes.success)
      return res.json(
        new UserServiceResponse(false, "Invalid Request", validationRes.payload)
      );

    const result = await UserService.getUserLoginCheckByEmail(req.body);
    if (!result.success) return res.json(result);

    setJwtToken(res, result.payload);
    res.json(result);
  } catch (e) {
    res
      .status(500)
      .json(new UserServiceResponse(false, "Error has occured!", e));
  }
});

UserRouter.delete("/:id", async (req, res) => {
  try {
    const validation = await UsersValidator.validateId(req.params.id, true);
    if (validation && !validation.success)
      return res.json(
        new UserServiceResponse(false, "Invalid Id!", validation.payload)
      );

    res.cookie("auth", "", { httpOnly: true, sameSite: "lax" });
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

UserRouter.get("/", getUserMiddleware, async (_, res) => {
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

UserRouter.get("/publickey", (_, res) => {
  res.json(
    new UserServiceResponse(true, "User jwt validation publickey", publicKey)
  );
});

export default UserRouter;
