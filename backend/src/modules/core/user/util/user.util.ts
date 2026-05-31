import { FindOptionsWhere } from "typeorm";
import { User } from "../entity/user/user.entity";
import * as crypto from 'crypto';
import dayjs from 'dayjs';

export function buildAlreadyExistingUserFindOptionsWhere(email: string, fiscalCode: string): FindOptionsWhere<User>[] {
    return [
        {email},
        {fiscalCode}
    ];
}

export function bildActivationTokenAndTokenExpires(): Pick<User, 'activationToken' | 'activationTokenExpires'>{
    return {
        activationToken: crypto.randomBytes(32).toString('hex'),
        activationTokenExpires: dayjs().add(48, 'hour').toDate(),
    };
}