import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY,
        projectId: process.env.PROJECT_ID,
      }),
      databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
    });

    this.db = admin.firestore()
  }

  getFirestoreInstance(): FirebaseFirestore.Firestore {
    return this.db
  }
}