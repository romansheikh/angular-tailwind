export interface ApiResponseModel<T = any> {
  Status: Status;
  Message: string;
  Body?: T | null;
}
export enum Status {
  Success = 200,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  InternalServerError = 500,
}
export interface LoginResponseModel {
  Email: string;
  FullName: string;
  AccessToken: string;
  RefreshToken: string;
  Expires: string;
  Avatar: string;
  UserName: string;
  UserId: string;
}
