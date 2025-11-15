import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'ATTORNEY' | 'PARALEGAL' | 'VIEWER';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['ADMIN', 'ATTORNEY', 'PARALEGAL', 'VIEWER'],
      default: 'ATTORNEY'
    },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (pw: string): Promise<boolean> {
  return bcrypt.compare(pw, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (pw: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
};

export interface UserModel extends mongoose.Model<IUser> {
  hashPassword(pw: string): Promise<string>;
}

export default mongoose.model<IUser, UserModel>('User', UserSchema);
