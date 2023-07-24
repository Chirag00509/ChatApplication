import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  users: any;
  sortName: any
  allMessages: any[] = [];
  currentId: any;
  userId: any;
  userName: any;
  sendMessageForm!: FormGroup;
  selectedMessageId: number | null = null;
  isDropdownOpen = false;
  displyMessage: string = ''
  editMessageId: number = 0;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      this.showMessage(userId);
      this.getUserList(userId);
    });
    this.initializeForm();
  }
  initializeForm() {
    this.sendMessageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
    })
  }

  getUserList(id: number) {

    const jwtToken = localStorage.getItem('authToken');

    if (!jwtToken) {
      console.error('JWT Token not found in local storage');
      return;
    }
    const decodedToken: any = jwt_decode(jwtToken);

    const Id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    this.userId = Id;
    this.userName = name;

    this.userService.userList().subscribe((res) => {

      const user = res.find(user => user.id === id);
      this.users = user.name;
      this.sortName = this.users.charAt(0);

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

  getControl(name: any): AbstractControl | null {
    return this.sendMessageForm.get(name);
  }

  showMessage(id: number) {
    // let id = this.route.snapshot.params['id'];

    this.currentId = id;
    this.userService.getMessage(id).subscribe((res) => {

      this.allMessages = [];

      res.forEach((message: any) => {
        const messageData = {
          timestamp: message.timestamp,
          content: message.content,
          senderId: message.senderId,
          id: message.id
        };

        this.allMessages.push(messageData);
      });
      this.allMessages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        alert(errorMessage);
      }
    });
  }

  sendMessages(data: any) {
    if (this.editMessageId == 0) {
      this.userService.sendMesage(data, this.currentId).subscribe((res) => {
        window.location.reload();
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          const errorMessage = error.error.message;
          alert(errorMessage);
        }
      })
    } else {
      this.userService.editMessage(this.editMessageId, this.displyMessage).subscribe((res) => {
        alert(res.message);
        window.location.reload();
      })
    }
  }

  deleteMessage(id: number) {
    this.userService.deleteMessage(id).subscribe((res) => {
      alert(res.message);
      window.location.reload();
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        alert(errorMessage);
      }
    })
  }

  editMessage(id: number, message: any) {
    this.displyMessage = message;
    this.editMessageId = id;
  }

  showDropdown(messageId: any) {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.selectedMessageId = this.selectedMessageId === messageId ? null : messageId;
  }
}
