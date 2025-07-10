import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "./aws";

export const saveItem = async <T extends Record<string, unknown>>(
  item: T,
  tableName: string
): Promise<{ status: boolean }> => {
  try {
    await dynamodb.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      })
    );
    return { status: true };
  } catch (e) {
    console.error(`DynamoDB Put Error [${tableName}]:`, e);
    return { status: false };
  }
};

export const fetchItem = async ({
  key,
  tableName,
}: {
  key: Record<string, string>;
  tableName: string;
}) => {
  try {
    const result = await dynamodb.send(
      new GetCommand({ TableName: tableName, Key: key })
    );

    if (result.Item)
      return {
        status: true,
        data: result.Item,
        message: "Data fetched successfully",
      };

    return {
      status: true,
      data: null,
      message: "Not Found",
    };
  } catch (e) {
    console.error(e);
    return { status: false, message: "Unable to fetch Items" };
  }
};

export const fetchAllItems = async (tableName: string) => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({ TableName: tableName })
    );

    if (result.Items)
      return {
        status: true,
        data: result.Items,
        message: "Data fetched successfully",
      };

    return {
      status: true,
      data: null,
      message: "Not Found",
    };
  } catch (e) {
    console.error(e);
    return { status: false, message: "Unable to fetch all Items" };
  }
};

export const updateItem = async ({
  key,
  tableName,
  updates,
}: {
  tableName: string;
  key: Record<string, unknown>;
  updates: Record<string, unknown>;
}) => {
  try {
    // Build update expression
    const updateExpression = `SET ${Object.keys(updates)
      .map((k, i) => `#key${i} = :val${i}`)
      .join(", ")}`;

    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, k, i) => ({ ...acc, [`#key${i}`]: k }),
      {}
    );

    const expressionAttributeValues = Object.values(updates).reduce<
      Record<string, unknown>
    >((acc, v, i) => ({ ...acc, [`:val${i}`]: v }), {});

    await dynamodb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return { status: true };
  } catch (e) {
    console.error("Update failed:", e);
    return { status: false };
  }
};
