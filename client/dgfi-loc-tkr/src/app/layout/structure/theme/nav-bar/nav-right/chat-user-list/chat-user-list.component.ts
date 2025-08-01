// Angular Import
import { Component, EventEmitter, Output } from '@angular/core';

// project import

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  standalone: false,
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent {
  // public props
  @Output() ChatCollapse = new EventEmitter();
  @Output() ChatToggle = new EventEmitter();
  searchFriends!: string;
  // eslint-disable-next-line
  // friendsList: any = FriendsList.friends;

  // public method
  ChatOn() {
    this.ChatToggle.emit();
  }
}
