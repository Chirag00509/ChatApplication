import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent {

  users: any;
  allMessages: any[] = [];
  currentId: any;
  sendMessageForm!: FormGroup;
  selectedMessageId: number | null = null;
  isDropdownOpen = false;
  displyMessage: string = ''
  editMessageId: number = 0;
  id: number = 0

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.initializeForm();
    this.showMessage();
    this.getUserList();

  }

  initializeForm() {
    this.sendMessageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
    })
  }

  getUserList() {
    this.userService.userList().subscribe((res) => {
      this.users = res[(this.id-2)];
      console.log(this.users.name);
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

  showMessage() {
    this.currentId = this.id;
    this.userService.getMessage(this.id).subscribe((res) => {

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