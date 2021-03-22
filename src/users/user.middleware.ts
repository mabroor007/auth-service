import { Request, Response, NextFunction } from "express";
import { UserServiceResponse } from "./user.dto";
import { getPayload } from "./user.token";

export const getUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.cookies.auth;
  if (!auth) res.json(new UserServiceResponse(false, "Login first", null));

  const result = getPayload(auth);
  if (!result.success)
    res.json(new UserServiceResponse(false, "Login again!", null));

  res.locals.user = result.payload;
  next();
};
