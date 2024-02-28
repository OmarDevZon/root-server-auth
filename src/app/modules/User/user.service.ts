/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Admin } from '../Admin/admin.model';
import { User } from './user.model';
import { TAdmin } from '../Admin/admin.interface';
import { TUser } from './user.interface';

const createAdminIntoDB = async (file: any, payload: TAdmin) => {
 

  // create a user object
  const userData: Partial<TUser> = {};

  //set role
  userData.role = 'admin';

  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  //set admin email & password
  userData.email = payload.email;
  userData.password = hashPassword as string;
  // start transition
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  profile image
    // if (file) {
    //   const imageName = `${userData.id}${payload?.name?.firstName}`;
    //   const path = file?.path;
    //  // send image to cloudinary
    //   const { secure_url } = await sendImageToCloudinary(imageName, path);
    //   payload.profileImg = secure_url as string;
    // }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });
    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    // set  _id as user
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    // completed transaction
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    // reject or error transaction
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;

  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createAdminIntoDB,
  getMe,
  changeStatus,
};
