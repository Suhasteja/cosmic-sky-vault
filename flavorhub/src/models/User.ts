import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  avatar?: string;
  firebaseUid: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  firebaseUid: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);