import { User } from './user';

export class Message {
    message: string;
    createdAt: Date;
    sender: User

    constructor({ message, creatAt, sender }) {
        this.message = message;
        this.createdAt = creatAt;
        this.sender = new User(sender);
    }
}
