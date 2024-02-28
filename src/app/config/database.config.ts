import mongoose from 'mongoose';
import config from '.';
import seedSuperAdmin from '../DB';

export async function databaseConnecting() {
  try {
    if (config.mongo_prod as object | undefined) {
      await mongoose.connect(config.database_url_pro as string);
      seedSuperAdmin();
      console.log('database        :🚀 Connected to database for Production');
    } else {
      await mongoose.connect(config.database_url_dev as string);
      seedSuperAdmin();
      console.log('database        :🚀 Connected to database for Development');
    }
  } catch (error) {
    console.error('database        :😈 Error connecting to the database');
  }
}
