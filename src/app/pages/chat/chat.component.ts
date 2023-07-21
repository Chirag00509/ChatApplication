import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: any[] = [];
  outgoing: any = [];
  incoming: any = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.userService.userList().subscribe((res) => {
      this.users = res;
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        if (errorMessage === undefined) {
          alert("unauthorized access")
        } else {
          alert(errorMessage);
        }
      }
    })
  }

  showMessage(id: any) {
    this.userService.getMessage(id).subscribe((res) => {
      this.outgoing = [];
      this.incoming = [];
      res.forEach((message: any) => {
        res.forEach((message: any) => {
          const messageData = {
            timestamp: message.timestamp,
            content: message.content
          };

          if (message.senderId == 1) {
            this.outgoing.push(messageData.content);
          } else if (message.senderId == 2) {
            this.incoming.push(messageData.content);
          }
        });
        this.outgoing.sort((a:any, b:any) => a.timestamp - b.timestamp);
        this.incoming.sort((a:any, b:any) => a.timestamp - b.timestamp);
      });
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        alert(errorMessage);
      }
    }
    )
  }
}
