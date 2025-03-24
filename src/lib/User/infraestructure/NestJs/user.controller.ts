import { Controller, Get, Inject } from '@nestjs/common';
import { UserGetAll } from '../../application/UserGetAll/UserGetAll';

@Controller('user')
export class UserController {
    constructor (
        @Inject('UserGetAll') 
        private readonly userGetall: UserGetAll,
    ) {}

    @Get()
    async getAll() {
        return this.userGetall.run();
    }
}
