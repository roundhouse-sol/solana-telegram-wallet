import * as React from 'react'
import { useShowPopup } from '@vkruglikov/react-telegram-web-app';
import { ChakraProvider, Flex, Box, FormControl, FormLabel, Input, Button, useToast, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';

type FormValues = {
  walletAddress: string;
  recipientAddress: string;
  amount: number;
};

type IUser = {
  userId: string;
  wallet: string;
  balance: string;
};


export default function Wallet() {
  const [user, setUser] = React.useState({} as IUser)
  const [confirmTransaction, setConfirmTransaction] = React.useState<boolean>(false)

  const toast = useToast()

  const userId = "235445"

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      walletAddress: user.wallet,
    }
  });

  const showPopup = useShowPopup();

  const sendTransaction = async (data: FormValues): Promise<any> => {
    try {
      const response: AxiosResponse<any, any> = await axios.post("http://localhost:3000/api/send/transaction", {
        userId,
        wallet: data.recipientAddress,
        amount: data.amount
      });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {

      await showPopup({
        title: "Transaction",
        message: `You accept the transaction in the amount of: ${data.amount} SOL`,
        buttons: [
          {
            type: 'ok',
            text: 'Confirm',
          },
          {
            type: 'destructive',
            text: 'Cancel',
          },
        ],
      })

      await sendTransaction(data)

      toast({
        title: 'Transaction success',
        description: "Transaction success",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

      setConfirmTransaction(true)
    }
    catch (err) {
      console.log(err)
      toast({
        title: 'Transaction rejected',
        description: "Check if you have value available in your wallet",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  };

  React.useEffect(() => {
    const getUser = async () => {
      const response = await axios.post(`http://localhost:3000/api/${userId}/balance`)
      setUser(response.data)
    }
    getUser()
  }, [])

  return (
    <ChakraProvider>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Box width="400px">
          <Box paddingBottom={5} textAlign="center">
            <Text fontSize='sm' marginBottom={2}>You wallet address: <b>{user.wallet}</b></Text>
            <Text fontSize='sm'> Amount in Wallet: {user.balance}</Text>
          </Box>
          {!confirmTransaction ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.walletAddress}>
                <FormLabel htmlFor="walletAddress">Wallet Address</FormLabel>
                <Input
                  id="walletAddress"
                  type="text"
                  {...register('walletAddress', { required: 'Wallet Address is required' })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.recipientAddress} mt={4}>
                <FormLabel htmlFor="recipientAddress">Recipient Address</FormLabel>
                <Input
                  id="recipientAddress"
                  type="text"
                  {...register('recipientAddress', { required: 'Recipient Address is required' })}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.amount} mt={4}>
                <FormLabel htmlFor="amount">Amount</FormLabel>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { required: 'Amount is required' })}
                />
              </FormControl>
              <Box alignItems="center" marginTop={8}>
                <Button type='submit' width={"100%"} colorScheme='facebook'>
                  Submit
                </Button>
              </Box>
            </form>
          ) : (
            <Text fontSize='3xl' textAlign="center">
              Transaction completed successfully
            </Text>
          )}

        </Box>
      </Flex>
    </ChakraProvider>
  );
}
