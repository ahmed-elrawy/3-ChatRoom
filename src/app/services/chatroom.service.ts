import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from "rxjs";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { LoadingService } from '../servies/loading.service';
import { AuthService } from './auth.service';
import { switchMap, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  public chatrooms: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;
  constructor(
    private db: AngularFirestore,
    private loadingService: LoadingService,
    private authService: AuthService

  ) {
    this.selectedChatroom = this.changeChatroom.pipe(
      switchMap(chatroomId => {
        if (chatroomId) {
          // this.loadingService.isLoading.next(true)
          return db.doc(`chatRooms/${chatroomId}`).valueChanges();
        }
        return of(null);
      }))

    this.selectedChatroomMessages = this.changeChatroom.pipe(
      switchMap(chatroomId => {
        if (chatroomId) {
          // this.loadingService.isLoading.next(true)
          return db.collection(`chatRooms/${chatroomId}/messages`, ref => {
            return ref.orderBy('createdAt', 'desc').limit(100);

          })
            .valueChanges()
            .pipe(
              map(arr => arr.reverse()
              )
            )
        }
        return of(null);
      }))
    this.chatrooms = this.db.collection<any>('chatRooms').valueChanges();
  }

  public createMessage(text: string): void {
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };
    this.db.collection(`chatRooms/${chatroomId}/messages`).add(message);
  }
}
