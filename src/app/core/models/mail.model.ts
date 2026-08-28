export type FolderType = 'INBOX' | 'STARRED' | 'IMPORTANT' | 'SENT' | 'DRAFTS' | 'ARCHIVE' | 'SPAM' | 'TRASH' | 'CUSTOM';
export type MessagePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface MailFolder {
  id: string;
  folderType: FolderType;
  displayName: string;
  iconName?: string;
  colorHex?: string;
  sortOrder: number;
  unreadCount: number;
  totalCount: number;
}

export interface EmailRecipient {
  type: 'TO' | 'CC' | 'BCC';
  name?: string;
  email: string;
}

export interface EmailAttachment {
  id: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  isScannedSafe: boolean;
  uploadProgress?: number;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  folderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatarUrl?: string;
  subject: string;
  snippet: string;
  bodyHtml: string;
  bodyText?: string;
  isUnread: boolean;
  isStarred: boolean;
  isImportant: boolean;
  isDraft: boolean;
  hasAttachments: boolean;
  isVerifiedEmsSender: boolean;
  priority: MessagePriority;
  snoozedUntil?: string;
  sentAt?: string;
  createdAt: string;
  recipients?: EmailRecipient[];
  attachments?: EmailAttachment[];
}

export interface SendMessagePayload {
  id?: string;
  threadId?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  attachmentIds?: string[];
  priority?: MessagePriority;
  scheduledAt?: string;
}

export interface StorageQuota {
  totalBytes: number;
  usedBytes: number;
  percentUsed: number;
  humanizedTotal: string;
  humanizedUsed: string;
}

export interface MailRule {
  id: string;
  ruleName: string;
  conditionField: 'FROM' | 'SUBJECT' | 'BODY';
  conditionOperator: 'CONTAINS' | 'EQUALS' | 'STARTS_WITH';
  conditionValue: string;
  actionType: 'MOVE_TO_FOLDER' | 'MARK_READ' | 'STAR' | 'DELETE';
  actionTargetFolderId?: string;
  isActive: boolean;
}
