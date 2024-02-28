import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const superAdmin = {
  id: 'SA-0001',
  email: 'super.admin@gmail.com',
  password: "Super@admin1234",
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
