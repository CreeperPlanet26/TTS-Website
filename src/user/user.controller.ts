import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserResponseObject } from './types/UserResponseObject';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
    constructor(private _service: UserService) { }

    @Get('users')
    public getAll(): Promise<UserResponseObject[]> {
        return this._service.getAll();
    }

    @Get('user/:id')
    public get(@Param('id') id: string): Promise<UserResponseObject> {
        return this._service.get(id);
    }

    @Get('me')
    public getMe(@Req() req: Request): Promise<UserResponseObject> {
        return this._service.getMe(req);
    }

    @Get('avatar/:id')
    public getAvatar(@Req() req: Request, @Res() res: Response) {
        return this._service.getAvatar(req, res)
    }
}
