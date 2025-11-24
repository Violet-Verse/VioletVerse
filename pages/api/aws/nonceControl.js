import {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb'
import { ddbClient } from '../utils/awsConfig'

export const getNonce = async (nonce) => {
  const params = {
    TableName: 'vv-nonces',
    Key: {
      nonces: {
        S: nonce,
      },
    },
  }
  try {
    const data = await ddbClient.send(new GetItemCommand(params))
    return data.Item || false
  } catch (err) {
    return false
  }
}

export const addNonce = async (nonce) => {
  const expireMinutes = 60 * 10
  const secondsSinceEpoch = Math.round(Date.now() / 1000)
  const expirationTime = secondsSinceEpoch + expireMinutes
  // Nonce will expire if not used

  const params = {
    TableName: 'vv-nonces',
    Item: {
      nonces: {
        S: nonce,
      },
      ttl: {
        N: expirationTime.toString(),
      },
    },
  }
  try {
    const data = await ddbClient.send(new PutItemCommand(params))
    return data
  } catch (err) {
    return err
  }
}

export const deleteNonce = async (nonce) => {
  const params = {
    TableName: 'vv-nonces',
    Key: {
      nonces: {
        S: nonce,
      },
    },
  }
  try {
    const data = await ddbClient.send(new DeleteItemCommand(params))
    return data
  } catch (err) {
    return err
  }
}

export default async function handler(req, res) {
  const deletedNonce = await deleteNonce(req.body.nonce)

  return res.status(200).json(deletedNonce || null)
}
