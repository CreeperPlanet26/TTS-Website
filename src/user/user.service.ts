import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { UserResponseObject } from './types/UserResponseObject';
import { User } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>
    ) { }

    public toResponseObject(doc: User): UserResponseObject {
        if (!doc) throw new HttpException('User was not found.', HttpStatus.NOT_FOUND);
        const obj = <UserResponseObject>{ ...doc.toObject() };

        // Split the name by #. 'cre#eper#4717' => ['cre', 'eper', '4717']
        const name = obj.tag.split('#');

        // Remove the last element. ['cre', 'eper', '4717'] => ['cre', 'eper'];
        name.pop();

        // Join the array into a string. ['cre', 'eper'] => 'creeper';
        obj.name = name.join('');

        return obj;
    }

    public async getAll(): Promise<UserResponseObject[]> {
        const users: UserResponseObject[] = [];
        for (const u of (await this.UserModel.find())) users.push(this.toResponseObject(u));

        return users;
    }

    public async get(id: string): Promise<UserResponseObject> {
        return this.toResponseObject(await this.UserModel.findOne({ id }));
    }

    public async getMe(req: Request): Promise<UserResponseObject> {
        console.log(req.session)
        if (!req.user) throw new HttpException('Please log in.', HttpStatus.UNAUTHORIZED);
        return this.toResponseObject(<User>req.user);
    }

}
