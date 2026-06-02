import { User } from '../../../core/user/entity/user/user.entity';
import { AccessTokenUser } from './access-token-user.model';

export interface AuthenticatedRequest extends Request {
  user: User & AccessTokenUser;
}
