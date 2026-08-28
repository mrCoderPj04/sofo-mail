import { Injectable, signal, computed } from '@angular/core';
import { EmailMessage, MailFolder, StorageQuota, SendMessagePayload } from '../models/mail.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private initialFolders: MailFolder[] = [
    { id: 'fld-inbox', folderType: 'INBOX', displayName: 'Inbox', iconName: 'inbox', colorHex: '#0ea5e9', sortOrder: 1, unreadCount: 2, totalCount: 4 },
    { id: 'fld-starred', folderType: 'STARRED', displayName: 'Starred', iconName: 'star', colorHex: '#eab308', sortOrder: 2, unreadCount: 0, totalCount: 1 },
    { id: 'fld-important', folderType: 'IMPORTANT', displayName: 'Important', iconName: 'bookmark', colorHex: '#f97316', sortOrder: 3, unreadCount: 1, totalCount: 2 },
    { id: 'fld-sent', folderType: 'SENT', displayName: 'Sent', iconName: 'send', colorHex: '#10b981', sortOrder: 4, unreadCount: 0, totalCount: 2 },
    { id: 'fld-drafts', folderType: 'DRAFTS', displayName: 'Drafts', iconName: 'file-edit', colorHex: '#64748b', sortOrder: 5, unreadCount: 0, totalCount: 1 },
    { id: 'fld-archive', folderType: 'ARCHIVE', displayName: 'Archive', iconName: 'archive', colorHex: '#8b5cf6', sortOrder: 6, unreadCount: 0, totalCount: 3 },
    { id: 'fld-spam', folderType: 'SPAM', displayName: 'Spam', iconName: 'shield-alert', colorHex: '#ef4444', sortOrder: 7, unreadCount: 0, totalCount: 0 },
    { id: 'fld-trash', folderType: 'TRASH', displayName: 'Trash', iconName: 'trash-2', colorHex: '#94a3b8', sortOrder: 8, unreadCount: 0, totalCount: 0 },
    { id: 'fld-cust-sec', folderType: 'CUSTOM', displayName: 'Security Briefings', iconName: 'shield', colorHex: '#0ea5e9', sortOrder: 9, unreadCount: 1, totalCount: 2 },
    { id: 'fld-cust-eng', folderType: 'CUSTOM', displayName: 'Architecture Reviews', iconName: 'cpu', colorHex: '#10b981', sortOrder: 10, unreadCount: 0, totalCount: 1 }
  ];

  private initialMessages: EmailMessage[] = [
    {
      id: 'msg-001',
      threadId: 'th-001',
      folderId: 'fld-inbox',
      senderName: 'PJSOFONIC EMS Security System',
      senderEmail: 'ems-security@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'SOFOMail Authentication & Security Architecture Overview',
      snippet: 'Welcome to the official SOFOMail enterprise communication platform. This system is authenticated via PJSOFONIC EMS with full MFA...',
      bodyHtml: `<p>Dear Elena,</p>
<p>Welcome to <strong>SOFOMail</strong>, the official and secure communication platform of <strong>PJSOFONIC</strong>.</p>
<p>Your mailbox was successfully provisioned and verified through the PJSOFONIC Enterprise Management System (EMS). All communications across this hub are secured with TLS encryption, mandatory Multi-Factor Authentication (MFA), and real-time audit logging.</p>
<p><strong>Security Highlights:</strong></p>
<ul>
  <li>EMS Single Sign-On with cryptographic session isolation</li>
  <li>DKIM, SPF, and DMARC enforcement on all incoming/outgoing messages</li>
  <li>Zero third-party data tracking or external advertisement scripts</li>
  <li>Continuous compliance tracking with SOC-2 and ISO 27001 standards</li>
</ul>
<p>If you have any questions regarding your corporate communication setup or mailbox retention policies, please reach out to the PJSOFONIC IT Security team.</p>
<p>Best regards,<br><em>PJSOFONIC Security Operations</em></p>`,
      bodyText: 'Welcome to SOFOMail...',
      isUnread: true,
      isStarred: true,
      isImportant: true,
      isDraft: false,
      hasAttachments: true,
      isVerifiedEmsSender: true,
      priority: 'HIGH',
      sentAt: '10:42 AM',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      recipients: [
        { type: 'TO', name: 'Elena Vance', email: 'elena.vance@pjsofonic.com' }
      ],
      attachments: [
        {
          id: 'att-001',
          fileName: 'PJSOFONIC_Security_Standards_v4.2.pdf',
          contentType: 'application/pdf',
          fileSizeBytes: 1845200,
          isScannedSafe: true
        }
      ]
    },
    {
      id: 'msg-002',
      threadId: 'th-002',
      folderId: 'fld-inbox',
      senderName: 'Marcus Chen',
      senderEmail: 'marcus.chen@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'Q3 Infrastructure Architecture Review and Next Steps',
      snippet: 'Elena, please take a look at the revised infrastructure topology for our upcoming platform rollout...',
      bodyHtml: `<p>Hi Elena,</p>
<p>Following our sync yesterday, we have updated the platform infrastructure specification. We have addressed the isolation boundaries between the EMS identity tier and the mail object storage cluster.</p>
<p>Could you review the attached architecture blueprint and confirm if the TLS 1.3 mutual handshake requirements meet the enterprise security baseline before our final sign-off?</p>
<p>Thanks,<br><strong>Marcus Chen</strong><br><span style="color: #64748b; font-size: 12px;">VP of Platform Engineering | PJSOFONIC</span></p>`,
      bodyText: 'Elena, please take a look at the revised infrastructure topology...',
      isUnread: true,
      isStarred: false,
      isImportant: true,
      isDraft: false,
      hasAttachments: true,
      isVerifiedEmsSender: true,
      priority: 'NORMAL',
      sentAt: 'Yesterday',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      recipients: [
        { type: 'TO', name: 'Elena Vance', email: 'elena.vance@pjsofonic.com' },
        { type: 'CC', name: 'Sarah Jenkins', email: 'sarah.jenkins@pjsofonic.com' }
      ],
      attachments: [
        {
          id: 'att-002',
          fileName: 'Platform_Topology_Architecture_Q3.pdf',
          contentType: 'application/pdf',
          fileSizeBytes: 3410200,
          isScannedSafe: true
        }
      ]
    },
    {
      id: 'msg-003',
      threadId: 'th-003',
      folderId: 'fld-inbox',
      senderName: 'Sarah Jenkins',
      senderEmail: 'sarah.jenkins@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'All-Hands Quarterly Strategy Note & Executive Summary',
      snippet: 'Team, as we conclude this sprint cycle, I want to thank everyone for their dedication to reliability and security excellence...',
      bodyHtml: `<p>Team,</p>
<p>As we conclude this sprint cycle, I want to thank everyone across our engineering, security, compliance, and operations divisions for their unwavering commitment to our core standards.</p>
<p><strong>Key achievements this quarter:</strong></p>
<ol>
  <li>Full deployment of the unified SOFOMail platform across all corporate offices</li>
  <li>Zero-trust authentication migration across 100% of EMS services</li>
  <li>Sub-15ms WebSocket push latency for all internal message routing</li>
</ol>
<p>Let us maintain this momentum into the upcoming fiscal review.</p>
<p>Warm regards,<br><strong>Sarah Jenkins</strong><br><span style="color: #64748b; font-size: 12px;">Chief Technology Officer, PJSOFONIC</span></p>`,
      bodyText: 'Team, as we conclude this sprint cycle...',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: false,
      hasAttachments: false,
      isVerifiedEmsSender: true,
      priority: 'NORMAL',
      sentAt: 'Aug 23',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      recipients: [
        { type: 'TO', name: 'All PJSOFONIC Staff', email: 'all@pjsofonic.com' }
      ]
    },
    {
      id: 'msg-004',
      threadId: 'th-004',
      folderId: 'fld-inbox',
      senderName: 'David Kim',
      senderEmail: 'david.kim@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'Annual Enterprise Audit Schedule & Data Governance Check',
      snippet: 'Elena, we have finalized the compliance review dates for the security architecture and audit logging subsystems...',
      bodyHtml: `<p>Elena,</p>
<p>Our team has published the annual data governance and audit validation calendar. Everything is tracking cleanly against our internal compliance milestones.</p>
<p>Please find the audit checklist ready for review in the governance portal.</p>
<p>Regards,<br><strong>David Kim</strong><br><span style="color: #64748b; font-size: 12px;">Senior Enterprise Auditor | PJSOFONIC</span></p>`,
      bodyText: 'Elena, we have finalized the compliance review dates...',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: false,
      hasAttachments: false,
      isVerifiedEmsSender: true,
      priority: 'NORMAL',
      sentAt: 'Aug 21',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      recipients: [
        { type: 'TO', name: 'Elena Vance', email: 'elena.vance@pjsofonic.com' }
      ]
    },
    {
      id: 'msg-005',
      threadId: 'th-005',
      folderId: 'fld-sent',
      senderName: 'Elena Vance',
      senderEmail: 'elena.vance@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'Re: Security Architecture Baseline Review',
      snippet: 'Marcus, I have reviewed the mutual TLS implementation guidelines. The changes are fully compliant with our policy...',
      bodyHtml: `<p>Marcus,</p><p>I have reviewed the mutual TLS implementation guidelines. The changes are fully compliant with our policy baseline.</p><p>You may proceed with stage 2 deployment.</p><p>Elena Vance<br>Lead Security Architect</p>`,
      bodyText: 'Marcus, I have reviewed the mutual TLS...',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: false,
      hasAttachments: false,
      isVerifiedEmsSender: true,
      priority: 'NORMAL',
      sentAt: 'Aug 22',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      recipients: [
        { type: 'TO', name: 'Marcus Chen', email: 'marcus.chen@pjsofonic.com' }
      ]
    },
    {
      id: 'msg-006',
      threadId: 'th-006',
      folderId: 'fld-drafts',
      senderName: 'Elena Vance',
      senderEmail: 'elena.vance@pjsofonic.com',
      senderAvatarUrl: '',
      subject: 'Draft: Zero Trust Access Review Guidelines for H2',
      snippet: 'Outlining updated certificate expiration windows and token lifetime defaults across all microservices...',
      bodyHtml: `<p>Outlining updated certificate expiration windows and token lifetime defaults across all microservices...</p>`,
      bodyText: 'Outlining updated certificate expiration windows...',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: true,
      hasAttachments: false,
      isVerifiedEmsSender: true,
      priority: 'NORMAL',
      sentAt: 'Draft',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      recipients: [
        { type: 'TO', name: 'Information Security Team', email: 'infosec@pjsofonic.com' }
      ]
    }
  ];

  // Reactive State Signals
  readonly folders = signal<MailFolder[]>(this.initialFolders);
  readonly messages = signal<EmailMessage[]>(this.initialMessages);
  readonly selectedFolderId = signal<string>('fld-inbox');
  readonly selectedMessageId = signal<string | null>(null);
  readonly selectedMessageIds = signal<string[]>([]);
  readonly filterTab = signal<'all' | 'unread' | 'starred' | 'attachments'>('all');
  readonly searchQuery = signal<string>('');
  readonly isComposeOpen = signal<boolean>(false);
  readonly composeMode = signal<'docked' | 'fullscreen' | 'minimized'>('docked');
  readonly composeDraft = signal<SendMessagePayload | null>(null);
  readonly activeSnoozeMessageId = signal<string | null>(null);

  // Storage Quota Signal
  readonly storageQuota = signal<StorageQuota>({
    totalBytes: 5368709120, // 5 GB
    usedBytes: 184549376,   // 176 MB
    percentUsed: 3.44,
    humanizedTotal: '5.0 GB',
    humanizedUsed: '176.0 MB'
  });

  // Computed Current Folder
  readonly currentFolder = computed(() => {
    return this.folders().find(f => f.id === this.selectedFolderId()) || this.folders()[0];
  });

  // Computed Filtered Email List
  readonly filteredMessages = computed(() => {
    const fId = this.selectedFolderId();
    const tab = this.filterTab();
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.messages();

    let list: EmailMessage[];

    if (fId === 'fld-starred') {
      list = all.filter(m => m.isStarred && !['fld-trash', 'fld-spam'].includes(m.folderId));
    } else if (fId === 'fld-important') {
      list = all.filter(m => m.isImportant && !['fld-trash', 'fld-spam'].includes(m.folderId));
    } else {
      list = all.filter(m => m.folderId === fId);
    }

    if (tab === 'unread') {
      list = list.filter(m => m.isUnread);
    } else if (tab === 'starred') {
      list = list.filter(m => m.isStarred);
    } else if (tab === 'attachments') {
      list = list.filter(m => m.hasAttachments);
    }

    if (query) {
      list = list.filter(m =>
        m.senderName.toLowerCase().includes(query) ||
        m.senderEmail.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.snippet.toLowerCase().includes(query) ||
        m.bodyHtml.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Computed Selected Message Object
  readonly selectedMessage = computed(() => {
    const id = this.selectedMessageId();
    if (!id) return null;
    return this.messages().find(m => m.id === id) || null;
  });

  // Computed Thread Messages
  readonly currentThreadMessages = computed(() => {
    const active = this.selectedMessage();
    if (!active) return [];
    return this.messages().filter(m => m.threadId === active.threadId);
  });

  // Computed Unread Total for Inbox
  readonly totalInboxUnread = computed(() => {
    return this.messages().filter(m => m.folderId === 'fld-inbox' && m.isUnread).length;
  });

  constructor(private notifications: NotificationService) {}

  selectFolder(folderId: string) {
    this.selectedFolderId.set(folderId);
    this.selectedMessageId.set(null);
    this.selectedMessageIds.set([]);
    this.filterTab.set('all');
  }

  selectMessage(message: EmailMessage | null) {
    if (message) {
      this.selectedMessageId.set(message.id);
      if (message.isUnread) {
        this.markAsRead(message.id);
      }
    } else {
      this.selectedMessageId.set(null);
    }
  }

  toggleStar(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, isStarred: !m.isStarred } : m)
    );
    this.updateFolderCounts();
  }

  toggleImportant(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, isImportant: !m.isImportant } : m)
    );
    this.updateFolderCounts();
  }

  markAsRead(messageId: string) {
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, isUnread: false } : m)
    );
    this.updateFolderCounts();
  }

  markAsUnread(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, isUnread: true } : m)
    );
    this.updateFolderCounts();
    this.notifications.info('Marked as unread');
  }

  archiveMessage(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.moveMessageToFolder(messageId, 'fld-archive');
    if (this.selectedMessageId() === messageId) {
      this.selectedMessageId.set(null);
    }
    this.notifications.info('Conversation archived');
  }

  deleteMessage(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.moveMessageToFolder(messageId, 'fld-trash');
    if (this.selectedMessageId() === messageId) {
      this.selectedMessageId.set(null);
    }
    this.notifications.info('Moved to trash');
  }

  snoozeMessage(messageId: string, snoozeDate: string) {
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, snoozedUntil: snoozeDate } : m)
    );
    this.activeSnoozeMessageId.set(null);
    this.notifications.info('Conversation snoozed until ' + snoozeDate);
  }

  moveMessageToFolder(messageId: string, targetFolderId: string) {
    this.messages.update(list =>
      list.map(m => m.id === messageId ? { ...m, folderId: targetFolderId } : m)
    );
    this.updateFolderCounts();
  }

  toggleSelectMessage(messageId: string, event?: Event) {
    if (event) event.stopPropagation();
    this.selectedMessageIds.update(ids => {
      if (ids.includes(messageId)) {
        return ids.filter(id => id !== messageId);
      } else {
        return [...ids, messageId];
      }
    });
  }

  toggleSelectAll() {
    const currentList = this.filteredMessages();
    const currentSelected = this.selectedMessageIds();

    if (currentSelected.length === currentList.length && currentList.length > 0) {
      this.selectedMessageIds.set([]);
    } else {
      this.selectedMessageIds.set(currentList.map(m => m.id));
    }
  }

  performBatchAction(action: 'read' | 'unread' | 'star' | 'unstar' | 'archive' | 'trash' | 'spam') {
    const ids = this.selectedMessageIds();
    if (ids.length === 0) return;

    this.messages.update(list => {
      return list.map(m => {
        if (!ids.includes(m.id)) return m;
        switch (action) {
          case 'read': return { ...m, isUnread: false };
          case 'unread': return { ...m, isUnread: true };
          case 'star': return { ...m, isStarred: true };
          case 'unstar': return { ...m, isStarred: false };
          case 'archive': return { ...m, folderId: 'fld-archive' };
          case 'trash': return { ...m, folderId: 'fld-trash' };
          case 'spam': return { ...m, folderId: 'fld-spam' };
          default: return m;
        }
      });
    });

    this.selectedMessageIds.set([]);
    this.updateFolderCounts();

    const humanizedLabels: Record<string, string> = {
      read: 'Marked as read',
      unread: 'Marked as unread',
      star: 'Starred',
      unstar: 'Unstarred',
      archive: 'Archived',
      trash: 'Moved to trash',
      spam: 'Marked as spam'
    };
    this.notifications.info(`${ids.length} conversations ${humanizedLabels[action]}`);
  }

  openCompose(initialData?: Partial<SendMessagePayload>) {
    this.composeDraft.set({
      to: initialData?.to || [],
      cc: initialData?.cc || [],
      bcc: initialData?.bcc || [],
      subject: initialData?.subject || '',
      bodyHtml: initialData?.bodyHtml || '',
      bodyText: initialData?.bodyText || '',
      priority: initialData?.priority || 'NORMAL'
    });
    this.isComposeOpen.set(true);
    this.composeMode.set('docked');
  }

  closeCompose() {
    this.isComposeOpen.set(false);
    this.composeDraft.set(null);
  }

  saveDraft(payload: SendMessagePayload) {
    const newDraft: EmailMessage = {
      id: payload.id || 'msg-dft-' + Math.random().toString(36).substring(2, 9),
      threadId: payload.threadId || 'th-dft-' + Math.random().toString(36).substring(2, 9),
      folderId: 'fld-drafts',
      senderName: 'Elena Vance',
      senderEmail: 'elena.vance@pjsofonic.com',
      subject: payload.subject || '(No subject)',
      snippet: payload.bodyText?.substring(0, 100) || '',
      bodyHtml: payload.bodyHtml || '',
      bodyText: payload.bodyText || '',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: true,
      hasAttachments: !!payload.attachmentIds && payload.attachmentIds.length > 0,
      isVerifiedEmsSender: true,
      priority: payload.priority || 'NORMAL',
      sentAt: 'Draft',
      createdAt: new Date().toISOString(),
      recipients: payload.to.map(email => ({ type: 'TO', email }))
    };

    this.messages.update(list => {
      const idx = list.findIndex(m => m.id === newDraft.id);
      if (idx >= 0) {
        const next = [...list];
        next[idx] = newDraft;
        return next;
      }
      return [newDraft, ...list];
    });

    this.updateFolderCounts();
  }

  sendMessage(payload: SendMessagePayload): boolean {
    if (!payload.to || payload.to.length === 0) {
      this.notifications.warning('Please specify at least one recipient.');
      return false;
    }

    const newMessage: EmailMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      threadId: payload.threadId || 'th-' + Math.random().toString(36).substring(2, 9),
      folderId: 'fld-sent',
      senderName: 'Elena Vance',
      senderEmail: 'elena.vance@pjsofonic.com',
      subject: payload.subject || '(No subject)',
      snippet: payload.bodyText?.substring(0, 100) || '',
      bodyHtml: payload.bodyHtml || '',
      bodyText: payload.bodyText || '',
      isUnread: false,
      isStarred: false,
      isImportant: false,
      isDraft: false,
      hasAttachments: !!payload.attachmentIds && payload.attachmentIds.length > 0,
      isVerifiedEmsSender: true,
      priority: payload.priority || 'NORMAL',
      sentAt: 'Just now',
      createdAt: new Date().toISOString(),
      recipients: payload.to.map(email => ({ type: 'TO', email }))
    };

    // Remove draft if sending existing draft
    if (payload.id) {
      this.messages.update(list => list.filter(m => m.id !== payload.id));
    }

    this.messages.update(list => [newMessage, ...list]);
    this.updateFolderCounts();
    this.closeCompose();
    this.notifications.success('Message sent');
    return true;
  }

  private updateFolderCounts() {
    const all = this.messages();
    this.folders.update(folders => {
      return folders.map(f => {
        if (f.folderType === 'STARRED') {
          const count = all.filter(m => m.isStarred && !['fld-trash', 'fld-spam'].includes(m.folderId)).length;
          return { ...f, totalCount: count };
        }
        if (f.folderType === 'IMPORTANT') {
          const unread = all.filter(m => m.isImportant && m.isUnread && !['fld-trash', 'fld-spam'].includes(m.folderId)).length;
          const count = all.filter(m => m.isImportant && !['fld-trash', 'fld-spam'].includes(m.folderId)).length;
          return { ...f, unreadCount: unread, totalCount: count };
        }
        const unread = all.filter(m => m.folderId === f.id && m.isUnread).length;
        const count = all.filter(m => m.folderId === f.id).length;
        return { ...f, unreadCount: unread, totalCount: count };
      });
    });
  }
}
