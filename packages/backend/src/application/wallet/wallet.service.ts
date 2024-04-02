import { Injectable } from '@nestjs/common';
import * as solanaWeb3 from '@solana/web3.js';
import { z } from 'zod';
import * as bs58 from 'bs58';
import { Wallet } from '@project-serum/anchor';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateAccountSchema } from '../accounts/accounts.dto';
import { Connection, PublicKey, } from '@solana/web3.js';


@Injectable()
export class WalletService {
  private connection: solanaWeb3.Connection;
  private accounts: any;

  constructor(
    private firebaseService: FirebaseService,
  ) {
    const firestore = this.firebaseService.getFirestoreInstance()
    this.accounts = firestore.collection('accounts');


    // Initialize Solana connection (adjust the cluster as needed)
    this.connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('devnet'),
      'confirmed',
    );
  }

  async get(userId: string): Promise<z.infer<typeof CreateAccountSchema> | null> {
    const user = await this.accounts.get(userId);

    return {
      ...user,
      walletPrivateKey: user?.walletPrivateKey,
    };
  }

  async update(
    userId: string,
    data: Partial<z.infer<typeof CreateAccountSchema>>,
  ): Promise<void> {
    delete data.userId;
    delete data.createdAt;
    delete data.walletPrivateKey;


    await this.accounts.update(userId, data);
  }

  async existingAccountData(userId: string): Promise<any> {
    const existingAccount = await this.accounts.doc(userId).get();

    return existingAccount.data()
  }

  async createOrGetAccount(
    userId: string,
    username: string,
    metadata: Partial<z.infer<typeof CreateAccountSchema>> = {},
  ): Promise<z.infer<typeof CreateAccountSchema>> {
    // Attempt to retrieve the account from Firestore
    //  const existing = this.existingAccountData(userId)

    //  if (existing) {
    //    return existing;
    //  }

    const { publicKey, privateKey } = await this.createNewWalletAddress();

    // If not existing, create a new account entity
    const newAccount = {
      userId,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSeenAt: new Date(),
      // Assuming these are placeholders and will be replaced
      groupId: metadata.groupId || '',
      referredBy: metadata.referredBy || '',
      walletPubKey: publicKey,
      walletPrivateKey: privateKey,
    };


    // Validate new account data with Zod schema
    //const validatedAccount = CreateAccountSchema.parse(newAccount);

    // Save the new account to Firestore
    const accountRef = await this.accounts.doc(userId);
    await accountRef.set(newAccount);

    return metadata;
  }

  async createNewWalletAddress(): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    // Generate a new keypair
    const keyPair = solanaWeb3.Keypair.generate();


    // Convert private key to a string or store securely
    const privateKey = keyPair.secretKey; // Convert Uint8Array to Array
    const publicKey = keyPair.publicKey.toString();


    return {
      publicKey,
      privateKey: this.secretKeyToHex(privateKey), // Convert array to string for easy storage
    };
  }

  getKeypairFromString = (secretKeyString: string) => {
    let decodedSecretKey: Uint8Array;
    try {
      decodedSecretKey = bs58.decode(secretKeyString);
    } catch (throwObject) {
      throw new Error('Invalid secret key! See README.md');
    }
    return solanaWeb3.Keypair.fromSecretKey(decodedSecretKey);
  };


  secretKeyToHex = (secretKey: Uint8Array) => {
    return bs58.encode(secretKey);
  };


  getAccountWallet = async (userId: string): Promise<Wallet> => {
    const account = await this.accounts.doc(userId).get();
    const dataAccount = account.data()
    if (!dataAccount) {
      throw new Error('Account not found');
    }
    return new Wallet(
      solanaWeb3.Keypair.fromSecretKey(bs58.decode(dataAccount.walletPrivateKey)),
    );
  };

  getBalanceAccount = async (userId: string): Promise<any> => {
    const account = await this.accounts.doc(userId).get();
    const dataAccount = account.data()

    if (!dataAccount) {
      throw new Error('Account not found');
    }

    const publicKey = new PublicKey(dataAccount.walletPubKey);

    const connection = new Connection('https://api.mainnet-beta.solana.com')
    const balance = await connection.getBalance(publicKey)

    return { userId: dataAccount.userId, balance: `${balance}`, wallet: dataAccount.walletPubKey }
  };

  async getOrCreateReferralLink(userId: string): Promise<string> {
    const account = await this.accounts.get(userId);


    if (!account) {
      throw new Error('Account not found');
    }


    if (account.referralId) {
      return account.referralId;
    }


    const referralId = this.generateReferralId();
    await this.accounts.update(userId, { referralId });


    return referralId;
  }


  generateReferralId(): string {
    return Math.random().toString(36).substr(2, 9);
  }


  async sendTransaction(userId: string, recipientAddress: any, amount: number): Promise<string> {
    try {
      const account = await this.accounts.doc(userId).get();
      const dataAccount = account.data()

      const privateKeyData = dataAccount.walletPrivateKey

      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), 'confirmed');

      const privateKey = bs58.decode(privateKeyData);
      const from = solanaWeb3.Keypair.fromSecretKey(privateKey)

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: recipientAddress,
          lamports: amount
        }),
      );
    
      const signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
      );

      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }


  async getReferralCount(referralId: string): Promise<number> {
    if (!referralId) return 0;
    const accounts = await this.accounts.rawCollection
      .where('referredBy', '==', referralId)
      .get();


    return accounts.size;
  }
}
