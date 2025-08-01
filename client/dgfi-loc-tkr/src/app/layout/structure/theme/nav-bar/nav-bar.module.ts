import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToggleFullScreenDirective } from '../../../../shared/components/full-screen/toggle-full-screen';
import { NavBarComponent } from './nav-bar.component';
import { NavLeftComponent } from './nav-left/nav-left.component';
import { NavSearchComponent } from './nav-left/nav-search/nav-search.component';
import { ChatMsgComponent } from './nav-right/chat-msg/chat-msg.component';
import { ChatUserListComponent } from './nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './nav-right/chat-user-list/friend/friend.component';
import { NavRightComponent } from './nav-right/nav-right.component';



@NgModule({
  declarations: [
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavSearchComponent,
    ChatMsgComponent,
    ChatUserListComponent,
    FriendComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgScrollbarModule,
    FormsModule,
    RouterLink,
    ToggleFullScreenDirective
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
