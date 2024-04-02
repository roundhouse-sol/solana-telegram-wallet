import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AccountsService {

  constructor(private readonly firebaseService: FirebaseService) {}

  async getAllAccounts(): Promise<any> {
    const firestore = this.firebaseService.getFirestoreInstance()
    const data = {casa: "banana"}
    const accountCollection = firestore.collection('accounts')
    const snapsshot = await accountCollection.get()

    const accounts: any = []
    snapsshot.forEach(doc => {
        const account = {
            id: doc.id,
            ...doc.data()
        }
        accounts.push(account)
    })

    return accounts
  }
    
}