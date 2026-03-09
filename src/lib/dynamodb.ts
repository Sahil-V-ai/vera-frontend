import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand, DeleteItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const validateEnv = () => {
  const required = ['AWS_DYNAMODB_TABLE', 'AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE!;

export interface DynamoRule {
  id: string;
  tenantId: string;
  name: string;
  triggerType: 'agents_says' | 'contains' | 'mentions_keywords' | 'amount_threshold' | 'missing_tag' | 'time_based';
  conditionValue: string;
  severity: 'low' | 'medium' | 'high';
  sendNotification: boolean;
  createdBy: string;
  createdAt: string;
  triggeredCount: number;
  lastTriggered: string | null;
  active?: boolean;
}

/**
 * Creates a new rule in DynamoDB
 */
export async function createRule(rule: Omit<DynamoRule, 'tenantId'> & { tenantId: string }): Promise<DynamoRule> {
  validateEnv();

  const item = {
    ...rule,
    createdAt: new Date().toISOString(),
    triggeredCount: rule.triggeredCount || 0,
    lastTriggered: rule.lastTriggered || null,
  };

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(item, { removeUndefinedValues: true }),
  });

  await dynamoClient.send(command);
  return item as DynamoRule;
}

/**
 * Fetches all rules for a specific tenant
 */
export async function getRulesByTenant(tenantId: string): Promise<DynamoRule[]> {
  validateEnv();

  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'tenantId = :tenantId',
    ExpressionAttributeValues: {
      ':tenantId': { S: tenantId },
    },
    ScanIndexForward: false, // newest first
  });

  const response = await dynamoClient.send(command);
  const items = response.Items?.map(item => unmarshall(item) as DynamoRule) || [];
  return items;
}

/**
 * Updates an existing rule
 */
export async function updateRule(tenantId: string, ruleId: string, updates: Partial<DynamoRule>): Promise<DynamoRule> {
  validateEnv();

  // Build UpdateExpression
  const updateExpressions: string[] = [];
  const expressionAttributeValues: any = {};
  const expressionAttributeNames: Record<string, string> = {};

  Object.entries(updates).forEach(([key, value], index) => {
    if (key === 'id' || key === 'tenantId') return;

    const placeholder = `:val${index}`;
    const namePlaceholder = `#name${index}`;

    updateExpressions.push(`${namePlaceholder} = ${placeholder}`);
    expressionAttributeValues[placeholder] = value;
    expressionAttributeNames[namePlaceholder] = key;
  });

  if (updateExpressions.length === 0) {
    throw new Error('No valid fields to update');
  }

  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ tenantId, id: ruleId }),
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  });

  const response = await dynamoClient.send(command);
  return unmarshall(response.Attributes!) as DynamoRule;
}

/**
 * Deletes a rule
 */
export async function deleteRule(tenantId: string, ruleId: string): Promise<void> {
  validateEnv();

  const command = new DeleteItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ tenantId, id: ruleId }),
  });

  await dynamoClient.send(command);
}

/**
 * Helper to check if a rule exists
 */
export async function ruleExists(tenantId: string, ruleId: string): Promise<boolean> {
  validateEnv();

  const command = new GetItemCommand({
    TableName: TABLE_NAME,
    Key: marshall({ tenantId, id: ruleId }),
  });

  const response = await dynamoClient.send(command);
  return !!response.Item;
}
