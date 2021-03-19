import validator from "validator";
import UsersEntity from "./user.entity";

class UsersValidator {
  err: string[] = [];
  async validateId(id: string, db: boolean) {
    if (!isString(id)) this.err.push("id must be a string!");
    if (db) {
      const res = await UsersEntity.findOne({ id });
      if (!res) this.err.push("No user found of this id!");
    }
    if (!validator.isUUID(id)) this.err.push("Invalid UserId");
    return this.getResults("id");
  }

  validateName(name: string): ValidationResult {
    if (!isString(name)) this.err.push("Name must be a string!");
    if (name.length < 8)
      this.err.push("Minimum length of name should be 8 character!");
    if (name.length > 30)
      this.err.push("Maximum length of name should be 30 character!");
    return this.getResults("name");
  }

  validateUserName(userName: string) {
    if (!isString(userName)) this.err.push("userName must be a string!");
    if (userName.length < 8)
      this.err.push("Minimum length of userName should be 8 character!");
    if (userName.length > 30)
      this.err.push("Maximum length of userName should be 30 character!");
    return this.getResults("userName");
  }

  validateEmail(email: string) {
    if (!isString(email)) this.err.push("Email must be a string!");
    if (!validator.isEmail(email)) this.err.push("Invalid Email!");

    return this.getResults("email");
  }

  validatePassword(password: string) {
    if (!isString(password)) this.err.push("Password must be a string!");
    if (!validator.isLength(password, { min: 8, max: 30 }))
      this.err.push("Password should 8 - 30 characters long!");

    return this.getResults("password");
  }

  validateDateOfBirth(dateOfBirth: string) {
    if (!isString(dateOfBirth)) this.err.push("DateOfBirth must be a string!");
    if (!validator.isDate(dateOfBirth)) this.err.push("Invalid Date Should Be yyyy-mm-dd format!");

    return this.getResults("dateOfBirth");
  }

  validatePhone(phone: string) {
    if (!isString(phone)) this.err.push("Phone must be a string!");
    if (!validator.isMobilePhone(phone)) this.err.push("Invalid Phone!");

    return this.getResults("phone");
  }

  validateImgUrl(url: string) {
    if (!isString(url)) this.err.push("imgUrl must be a string!");
    if (!validator.isURL(url)) this.err.push("Invalid Url!");
    return this.getResults("imgUrl");
  }

  validateAll(body: any): ValidationResult {
    console.log(this.err);
    this.validateImgUrl(body.imgUrl);
    this.validatePhone(body.phone);
    this.validateUserName(body.userName);
    this.validateDateOfBirth(body.dateOfBirth);
    this.validateName(body.name);
    this.validateEmail(body.email);
    return this.getResults("all");
  }

  getResults(property: string) {
    if (this.err.length > 0) {
      return new ValidationResult(false, "Invalid Payload!", {
        property,
        errors: this.err,
      });
    }
    return new ValidationResult(true, "Passed Validation!", null);
  }
}

const UserValidatorInstance = new UsersValidator();

export default UserValidatorInstance;

export class ValidationResult {
  constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly payload: { property: string; errors: string[] } | null
  ) {}
}

function isString(field: any): boolean {
  if (typeof field !== "string") return false;
  return true;
}
