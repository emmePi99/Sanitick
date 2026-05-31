import { User } from "src/modules/core/user/entity/user/user.entity";

export interface AuthenticatedRequest extends Request {
  user: Exclude<User, { id: string, email: string, }>;
}