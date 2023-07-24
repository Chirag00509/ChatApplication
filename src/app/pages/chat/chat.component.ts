import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: any[] = [];
  allMessages: any[] = [];
  currentId: any;
  sendMessageForm!: FormGroup;
  selectedMessageId: number | null = null;
  isDropdownOpen = false;

  constructor(private userService: UserService, private formBuilder : FormBuilder, private router : Router ) { }

  ngOnInit(): void {
    this.getUserList();
    this.initializeForm();
  }

  initializeForm() {
    this.sendMessageForm = this.formBuilder.group({
      message : new FormControl('', [ Validators.required ]),
    })
  }

  getControl(name: any) : AbstractControl | null  {
    return this.sendMessageForm.get(name);
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
    this.userService.sendMesage(data, this.currentId).subscribe((res) => {
    }, (error) => {
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error.message;
        alert(errorMessage);
      }
    })
  }

  deleteMessage(id: any) {
    console.log(id);
  }

  editMessage(id: any) {
    console.log(id);
  }

  showDropdown(messageId : any) {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.selectedMessageId = this.selectedMessageId === messageId ? null : messageId;
  }


  toggleDropdown(): void {
  }

}
