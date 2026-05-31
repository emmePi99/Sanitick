export interface AccessTokenUser {
    sub: string;
    email: string;
    role: string;
    impersonatorId?: string;
}