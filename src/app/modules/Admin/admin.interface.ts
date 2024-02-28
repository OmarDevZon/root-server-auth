import {  Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'other';


export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TAdmin = {
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  password: string;
  contactNo: string;
  profileImg?: string;
  isDeleted: boolean;
};
