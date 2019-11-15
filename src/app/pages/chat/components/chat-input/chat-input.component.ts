import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  public newMessageText: string = '';

  constructor(
    private chatroomService: ChatroomService
  ) {
  }

  ngOnInit() {
  }

  public submit(message: string): void {
    // TODO save text to Firebase backend
    this.chatroomService.createMessage(message);
    console.log('New Message: ', message);

    // reset input
    this.newMessageText = '';
  }
}
