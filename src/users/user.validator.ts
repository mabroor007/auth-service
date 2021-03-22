import { SimpleConsoleLogger } from "typeorm";
import validator from "validator";
import UsersEntity from "./user.entity";

class UsersValidator {
  async validateId(
    id: string,
    db: boolean,
    err: string[] = [],
    combine: boolean = false
  ): Promise<ValidationResult | undefined> {
    if (!isString(id)) err.push("id must be a string!");
    if (db) {
      const res = await UsersEntity.findOne({ id });
      if (!res) err.push("No user found of this id!");
    }
    if (!validator.isUUID(id)) err.push("Invalid UserId");
    if (!combine) return this.getResults("id", err);
  }

  validateName(
    name: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(name)) err.push("Name must be a string!");
    if (name.length < 8)
      err.push("Minimum length of name should be 8 character!");
    if (name.length > 30)
      err.push("Maximum length of name should be 30 character!");
    if (!combine) return this.getResults("name", err);
  }

  validateUserName(
    userName: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(userName)) err.push("userName must be a string!");
    if (userName.length < 8)
      err.push("Minimum length of userName should be 8 character!");
    if (userName.length > 30)
      err.push("Maximum length of userName should be 30 character!");
    if (!combine) return this.getResults("userName", err);
  }

  async validateEmail(
    email: string,
    db: boolean,
    err: string[] = [],
    combine: boolean = false
  ): Promise<ValidationResult | undefined> {
    if (!isString(email)) err.push("Email must be a string!");
    if (!validator.isEmail(email)) err.push("Invalid Email!");
    if (db) {
      const alreadyRegisteredUser = await UsersEntity.findOne({ email });
      if (alreadyRegisteredUser)
        err.push("User with this Email Already Exists!");
    }

    if (!combine) return this.getResults("email", err);
  }

  validatePassword(
    password: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(password)) err.push("Password must be a string!");
    if (!validator.isLength(password, { min: 8, max: 30 }))
      err.push("Password should 8 - 30 characters long!");

    if (!combine) return this.getResults("password", err);
  }

  validateDateOfBirth(
    dateOfBirth: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(dateOfBirth)) err.push("DateOfBirth must be a string!");
    if (!validator.isDate(dateOfBirth))
      err.push("Invalid Date Should Be yyyy-mm-dd format!");

    if (!combine) return this.getResults("dateOfBirth", err);
  }

  validatePhone(
    phone: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(phone)) err.push("Phone must be a string!");
    if (!validator.isMobilePhone(phone)) err.push("Invalid Phone!");

    if (!combine) return this.getResults("phone", err);
  }

  validateImgUrl(
    url: string,
    err: string[] = [],
    combine: boolean = false
  ): ValidationResult | undefined {
    if (!isString(url)) err.push("imgUrl must be a string!");
    if (!validator.isURL(url)) err.push("Invalid Url!");
    if (!combine) return this.getResults("imgUrl", err);
  }

  async signUpValidator(body: any): Promise<ValidationResult> {
    const err: string[] = [];
    this.validateImgUrl(body.imgUrl, err, true);
    this.validatePhone(body.phone, err, true);
    this.validateUserName(body.userName, err, true);
    this.validateDateOfBirth(body.dateOfBirth, err, true);
    this.validateName(body.name, err, true);
    await this.validateEmail(body.email, true, err, true);
    return this.getResults("all", err);
  }

  loginValidator(body: any, err: string[] = []) {
    const { email, password } = body;
    if (!isString(email)) err.push("Email should be a string!");
    if (!isString(password)) err.push("Password should be a string!");
    if (email && !validator.isEmail(email)) err.push("Invalid Email!");

    return this.getResults("login", err);
  }

  getResults(property: string, err: string[]) {
    if (err.length > 0) {
      return new ValidationResult(false, "Invalid Payload!", {
        property,
        errors: err,
      });
    }
    return new ValidationResult(true, "Passed Validation!", null);
  }
}

const userValidator = new UsersValidator();

export default userValidator;

export class ValidationResult {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly payload: { property: string; errors: string[] } | null
  ) {}
}

function isString(field: string): boolean {
  if (!field) return false;
  if (typeof field !== "string") return false;
  return true;
}
