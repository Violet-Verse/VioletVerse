import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const ddbClient = new DynamoDBClient({
    region: process.env.VV_AWS_REGION,
    accessKeyId: process.env.VV_AWS_ACCESS_KEY,
    secretAccessKey: process.env.VV_AWS_SECRET_ACCESS_KEY,
});
