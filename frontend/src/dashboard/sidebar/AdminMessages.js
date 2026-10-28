import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Modal, Input, Tag, message as antMessage, Tabs, Badge, Tooltip } from 'antd';
import {
  MailOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  HistoryOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  AlertOutlined
} from '@ant-design/icons';
import Http from '../../Helper/Http';
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import moment from "moment";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Single Modal State for total reliability
  const [modalState, setModalState] = useState({
    visible: false,
    message: null,
    isReadOnly: true,
  });
  const [replyText, setReplyText] = useState('');

  // Filtering state
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();

  const fetchMessages = () => {
    setLoading(true);
    Http.get('/api/v1/contact/admin/messages')
      .then(res => setMessages(res.data || []))
      .catch(err => antMessage.error(err.response?.data?.message || 'Failed to load inquiries'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Map of inquiries count per customer email
  const inquiriesByEmail = useMemo(() => {
    const map = {};
    messages.forEach(msg => {
      const email = (msg.email || '').toLowerCase().trim();
      if (!email) return;
      if (!map[email]) map[email] = [];
      map[email].push(msg);
    });
    return map;
  }, [messages]);

  // Open strictly read-only view for an inquiry that has already been answered
  const handleViewReply = (msg) => {
    setReplyText('');
    setModalState({
      visible: true,
      message: msg,
      isReadOnly: true,
    });
  };

  // Open one-time response modal for an inquiry that needs a reply
  const handleOpenReply = (msg) => {
    // Extra safety: if already replied, force read-only
    if (msg.adminReply && msg.adminReply.trim()) {
      handleViewReply(msg);
      return;
    }
    setReplyText('');
    setModalState({
      visible: true,
      message: msg,
      isReadOnly: false,
    });
  };

  const handleCloseModal = () => {
    setModalState({ visible: false, message: null, isReadOnly: true });
    setReplyText('');
  };

  // Submit official reply (once only)
  const submitReply = () => {
    if (!replyText.trim()) {
      antMessage.warning('Please enter a response message');
      return;
    }

    const targetMsg = modalState.message;
    if (!targetMsg || (targetMsg.adminReply && targetMsg.adminReply.trim())) {
      antMessage.error('This inquiry has already been answered and is locked.');
      return;
    }

    setSubmitting(true);
    Http.post(`/api/v1/contact/admin/reply/${targetMsg._id}`, { reply: replyText.trim() })
      .then(() => {
        antMessage.success('Official response sent and ticket locked!');
        const now = new Date();
        const updatedMsg = {
          ...targetMsg,
          adminReply: replyText.trim(),
          repliedAt: now,
          status: 'replied'
        };

        // Update list
        setMessages(prev =>
          prev.map(msg => msg._id === targetMsg._id ? updatedMsg : msg)
        );

        // Instantly transition the modal into locked read-only mode so user sees the sent response
        setModalState({
          visible: true,
          message: updatedMsg,
          isReadOnly: true,
        });
        setReplyText('');
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Failed to send response';
        antMessage.error(errorMsg);
        // If backend says already replied, refresh list and switch to read-only
        if (err.response?.data?.alreadyReplied) {
          fetchMessages();
          handleCloseModal();
        }
      })
      .finally(() => setSubmitting(false));
  };

  // Counts for tabs
  const needsReplyCount = useMemo(() => messages.filter(m => !m.adminReply || !m.adminReply.trim()).length, [messages]);
  const repliedCount = useMemo(() => messages.filter(m => !!(m.adminReply && m.adminReply.trim())).length, [messages]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const isReplied = Boolean(msg.adminReply && msg.adminReply.trim());
      // Tab filter
      if (activeTab === 'pending' && isReplied) return false;
      if (activeTab === 'replied' && !isReplied) return false;

      // Search filter
      if (searchText.trim()) {
        const query = searchText.toLowerCase().trim();
        const name = (msg.name || '').toLowerCase();
        const email = (msg.email || '').toLowerCase();
        const content = (msg.message || '').toLowerCase();
        const subject = (msg.subject || '').toLowerCase();
        return name.includes(query) || email.includes(query) || content.includes(query) || subject.includes(query);
      }
      return true;
    });
  }, [messages, activeTab, searchText]);

  // Related inquiries from the same customer (for the currently viewed inquiry)
  const relatedInquiries = useMemo(() => {
    if (!modalState.message?.email) return [];
    const emailKey = modalState.message.email.toLowerCase().trim();
    return (inquiriesByEmail[emailKey] || []).filter(m => m._id !== modalState.message._id);
  }, [modalState.message, inquiriesByEmail]);

  const activeMsg = modalState.message;
  const isAnswered = Boolean(activeMsg?.adminReply && activeMsg.adminReply.trim());
  const isReadOnlyMode = modalState.isReadOnly || isAnswered;

  const columns = [
    {
      title: 'Sender & Contact',
      key: 'sender',
      width: 240,
      render: (_, record) => {
        const emailKey = (record.email || '').toLowerCase().trim();
        const totalFromUser = (inquiriesByEmail[emailKey] || []).length;
        const hasFollowUps = totalFromUser > 1;

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                {(record.name || 'U').charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                {record.name || 'Anonymous User'}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono pl-9 truncate">
              {record.email}
            </div>
            {record.phone && (
              <div className="text-[11px] text-slate-400 pl-9 flex items-center gap-1">
                <PhoneOutlined className="text-[10px]" /> {record.phone}
              </div>
            )}
            {hasFollowUps && (
              <div className="pl-9 pt-0.5">
                <Tooltip title={`This customer has submitted ${totalFromUser} separate inquiries.`}>
                  <Tag color="cyan" className="text-[10px] rounded-md px-1.5 py-0 flex items-center gap-1 w-fit">
                    <HistoryOutlined /> {totalFromUser} Inquiries
                  </Tag>
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Inquiry Message',
      key: 'message',
      render: (_, record) => (
        <div className="max-w-md py-1">
          {record.subject && (
            <div className="text-xs font-bold text-slate-800 mb-0.5">
              {record.subject}
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {record.message}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
            <ClockCircleOutlined />
            <span>{moment(record.createdAt).format('DD MMM YYYY, hh:mm A')}</span>
            <span>•</span>
            <span>{moment(record.createdAt).fromNow()}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (_, record) => {
        const hasReplied = Boolean(record.adminReply && record.adminReply.trim());
        return hasReplied ? (
          <div className="space-y-1 text-center">
            <Tag color="success" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-emerald-300">
              <LockOutlined className="mr-1" /> Replied • Locked
            </Tag>
            {record.repliedAt && (
              <div className="text-[10px] text-slate-400">
                {moment(record.repliedAt).format('DD MMM, hh:mm A')}
              </div>
            )}
          </div>
        ) : (
          <Tag color="warning" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold border-amber-300">
            <ClockCircleOutlined className="mr-1" /> Needs Reply
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const hasReplied = Boolean(record.adminReply && record.adminReply.trim());
        return hasReplied ? (
          <Button
            size="small"
            onClick={() => handleViewReply(record)}
            className="border-slate-300 text-slate-700 hover:text-emerald-600 hover:border-emerald-500 rounded-lg text-xs font-medium flex items-center gap-1.5 mx-auto"
          >
            <EyeOutlined />
            <span>View Reply</span>
          </Button>
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={() => handleOpenReply(record)}
            className="bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-lg text-xs font-semibold shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 mx-auto"
          >
            <SendOutlined />
            <span>Reply Once</span>
          </Button>
        );
      },
    },
  ];

  return (
    <Layout title="Dashboard : Customer Inquiries">
      <div className="p-4 sm:p-6 bg-slate-50 min-h-[calc(100vh-64px)]">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => navigate('/admin')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                title="Back to Dashboard"
              >
                <ArrowLeftOutlined />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <MailOutlined className="text-emerald-600" />
                  Customer Inquiries & Support Tickets
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Discrete one-time ticket responses. Continuous loop chatting is disabled.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</span>
                <span className="text-base font-bold text-slate-900">{messages.length}</span>
              </div>
              <div className="flex-1 sm:flex-none px-3.5 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="block text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending</span>
                <span className="text-base font-bold text-amber-800">{needsReplyCount}</span>
              </div>
              <div className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider">Replied</span>
                <span className="text-base font-bold text-emerald-800">{repliedCount}</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="inquiry-tabs"
              items={[
                {
                  key: 'all',
                  label: (
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                      All Inquiries
                      <Badge count={messages.length} overflowCount={99} className="site-badge" />
                    </span>
                  ),
                },
                {
                  key: 'pending',
                  label: (
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-700">
                      Needs Reply
                      <Badge count={needsReplyCount} overflowCount={99} style={{ backgroundColor: '#f59e0b' }} />
                    </span>
                  ),
                },
                {
                  key: 'replied',
                  label: (
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700">
                      Replied & Locked
                      <Badge count={repliedCount} overflowCount={99} style={{ backgroundColor: '#10b981' }} />
                    </span>
                  ),
                },
              ]}
            />

            <div className="w-full md:w-72">
              <Input
                placeholder="Search by name, email, query..."
                prefix={<SearchOutlined className="text-slate-400 text-xs" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="rounded-xl border-slate-200 text-xs py-2 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredMessages}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  <MailOutlined className="text-3xl text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No inquiries found matching criteria</p>
                </div>
              ),
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* SINGLE UNIFIED MODAL (STRICT READ-ONLY OR ONE-TIME REPLY) */}
        {/* ======================================================== */}
        <Modal
          title={
            <div className="flex items-center justify-between pr-6">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                {isReadOnlyMode ? (
                  <>
                    <LockOutlined className="text-emerald-600" />
                    Inquiry Details & Sent Response
                  </>
                ) : (
                  <>
                    <SendOutlined className="text-emerald-600" />
                    Send One-Time Response
                  </>
                )}
              </span>
              {isReadOnlyMode && (
                <Tag color="success" className="rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  <LockOutlined className="mr-1" /> Locked Ticket
                </Tag>
              )}
            </div>
          }
          open={modalState.visible}
          onCancel={handleCloseModal}
          width={640}
          footer={
            isReadOnlyMode ? [
              <Button
                key="close"
                type="primary"
                onClick={handleCloseModal}
                className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl px-6 text-xs font-semibold"
              >
                Close
              </Button>
            ] : [
              <Button
                key="cancel"
                onClick={handleCloseModal}
                className="rounded-xl px-4 text-xs"
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={submitting}
                onClick={submitReply}
                className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-xl px-5 text-xs font-semibold flex items-center gap-1.5"
              >
                <SendOutlined />
                Send & Lock Ticket
              </Button>
            ]
          }
        >
          {activeMsg && (
            <div className="space-y-4 py-2">
              {/* Customer Inquiry Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Customer Inquiry
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      From: <strong className="text-slate-800">{activeMsg.name}</strong> ({activeMsg.email})
                      {activeMsg.phone && <span> • Tel: {activeMsg.phone}</span>}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {moment(activeMsg.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </span>
                </div>

                {activeMsg.subject && (
                  <div className="text-xs font-semibold text-slate-700 mb-1">
                    Subject: {activeMsg.subject}
                  </div>
                )}
                
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  "{activeMsg.message}"
                </div>
              </div>

              {/* READ-ONLY SENT RESPONSE VIEW (NO EDITING POSSIBLE) */}
              {isReadOnlyMode ? (
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircleOutlined className="text-emerald-600" />
                      Official Admin Response (Dispatched & Locked)
                    </span>
                    {activeMsg.repliedAt && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Sent on {moment(activeMsg.repliedAt).format('DD MMM YYYY, hh:mm A')}
                      </span>
                    )}
                  </div>

                  {/* Strictly non-editable read-only container */}
                  <div className="p-3.5 bg-white rounded-lg border border-emerald-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeMsg.adminReply}
                  </div>

                  <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-emerald-800">
                    <LockOutlined className="mt-0.5 shrink-0" />
                    <span>
                      <strong>Ticket Locked:</strong> This response was emailed to the customer. To prevent continuous chat loops, this inquiry cannot be edited or re-answered.
                    </span>
                  </div>
                </div>
              ) : (
                /* ONE-TIME REPLY INPUT (ONLY FOR UNANSWERED TICKETS) */
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Write One-Time Official Response</span>
                    <span className="text-[11px] font-normal text-slate-400">Sent to customer's email</span>
                  </label>
                  <Input.TextArea
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official response here..."
                    className="rounded-xl border-slate-200 text-sm p-3 focus:border-emerald-500"
                  />
                  <div className="p-2.5 mt-2 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-xs text-amber-800">
                    <AlertOutlined className="mt-0.5 shrink-0 text-amber-600" />
                    <span>
                      <strong>Important:</strong> Once you click <strong>Send & Lock Ticket</strong>, your response is sent to <strong>{activeMsg.email}</strong> and this ticket will be permanently locked. Continuous chat is not supported.
                    </span>
                  </div>
                </div>
              )}

              {/* Related inquiries from same customer if they submitted other queries */}
              {relatedInquiries.length > 0 && (
                <div className="p-3.5 bg-slate-100/70 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <HistoryOutlined className="text-slate-500" />
                    Other Inquiries from this Customer ({relatedInquiries.length})
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {relatedInquiries.map(rel => {
                      const relReplied = Boolean(rel.adminReply && rel.adminReply.trim());
                      return (
                        <div
                          key={rel._id}
                          className="p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-700 truncate font-medium">"{rel.message}"</p>
                            <span className="text-[10px] text-slate-400">
                              {moment(rel.createdAt).format('DD MMM YYYY, hh:mm A')}
                            </span>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {relReplied ? (
                              <Tag color="success" className="text-[10px] m-0">Replied</Tag>
                            ) : (
                              <Tag color="warning" className="text-[10px] m-0">Needs Reply</Tag>
                            )}
                            <Button
                              size="small"
                              type="link"
                              className="text-xs p-0 text-emerald-600"
                              onClick={() => {
                                if (relReplied) {
                                  handleViewReply(rel);
                                } else {
                                  handleOpenReply(rel);
                                }
                              }}
                            >
                              {relReplied ? 'View' : 'Answer'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminMessages;
