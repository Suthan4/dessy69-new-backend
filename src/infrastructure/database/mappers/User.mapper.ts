import { User, UserRole } from "@/domain/entities/User.entity";
import { IUserDocument } from "../models/User.Model";

export class UserMapper{
    static mapToEntity(doc:IUserDocument):User{
       return new User(
         doc._id.toString(),
         doc.email,
         doc.name,
         doc.phone,
         doc.password,
         doc.role as UserRole,
         doc.createdAt
       );
    }
}