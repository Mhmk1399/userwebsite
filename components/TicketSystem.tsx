"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaTicketAlt, FaPlus, FaPaperPlane, FaComments } from "react-icons/fa";

interface Message {
  sender: "customer" | "admin";
  content: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface TicketSystemProps {
  isAuthenticated: boolean;
  logout: () => void;
}

const TicketSystem: React.FC<TicketSystemProps> = ({ isAuthenticated, logout }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: "", content: "", priority: "medium" });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const fetchTickets = async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingTickets(true);
    try {
      const token = localStorage.getItem("tokenUser");
      const response = await fetch('/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("خطا در دریافت تیکتها");
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const createTicket = async () => {
    if (!newTicketForm.subject || !newTicketForm.content) {
      toast.error("موضوع و محتوا الزامی است");
      return;
    }

    try {
      const token = localStorage.getItem("tokenUser");
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicketForm)
      });
      
      if (response.ok) {
        toast.success("تیکت با موفقیت ایجاد شد");
        setNewTicketForm({ subject: "", content: "", priority: "medium" });
        setShowNewTicketForm(false);
        fetchTickets();
      } else {
        toast.error("خطا در ایجاد تیکت");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("خطای سرور");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const token = localStorage.getItem("tokenUser");
      const response = await fetch(`/api/tickets/${selectedTicket._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedTicket(data.ticket);
        setNewMessage("");
        fetchTickets();
      } else {
        toast.error("خطا در ارسال پیام");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("خطای سرور");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const getTicketStatusColor = (status: string) => {
    const colors = {
      open: 'bg-green-500/20 text-green-300',
      'in-progress': 'bg-blue-500/20 text-blue-300',
      resolved: 'bg-purple-500/20 text-purple-300',
      closed: 'bg-gray-500/20 text-gray-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const getTicketStatusText = (status: string) => {
    const statusTexts = {
      open: 'باز',
      'in-progress': 'در حال بررسی',
      resolved: 'حل شده',
      closed: 'بسته شده'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-500/20 text-green-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-orange-500/20 text-orange-300',
      urgent: 'bg-red-500/20 text-red-300'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500/20 text-gray-300';
  };

  const getPriorityText = (priority: string) => {
    const priorityTexts = {
      low: 'کم',
      medium: 'متوسط',
      high: 'بالا',
      urgent: 'فوری'
    };
    return priorityTexts[priority as keyof typeof priorityTexts] || priority;
  };

  if (selectedTicket) {
    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl rounded-2xl mx-4 text-white overflow-hidden" dir="rtl">
        <div className="p-4 lg:p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedTicket(null)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              بازگشت
            </button>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(selectedTicket.status)}`}>
                {getTicketStatusText(selectedTicket.status)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                {getPriorityText(selectedTicket.priority)}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
          <p className="text-white/70 text-sm mt-1">
            #{selectedTicket._id.slice(-8)} • {new Date(selectedTicket.createdAt).toLocaleDateString('fa-IR')}
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-4 lg:p-6 space-y-4">
          {selectedTicket.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                  message.sender === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 lg:p-6 border-t border-white/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 lg:p-6 shadow-2xl rounded-2xl mx-4 text-white" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl lg:text-2xl font-bold flex items-center gap-3">
          <FaTicketAlt className="text-xl" />
          پشتیبانی
        </h3>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <FaPlus className="text-sm" />
          تیکت جدید
        </button>
      </div>

      {showNewTicketForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h4 className="text-lg font-bold mb-4">ایجاد تیکت جدید</h4>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="موضوع تیکت"
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <select
              value={newTicketForm.priority}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="low" className="text-gray-800">اولویت کم</option>
              <option value="medium" className="text-gray-800">اولویت متوسط</option>
              <option value="high" className="text-gray-800">اولویت بالا</option>
              <option value="urgent" className="text-gray-800">فوری</option>
            </select>
            <textarea
              placeholder="توضیحات مسئله"
              value={newTicketForm.content}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={createTicket}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                ارسال تیکت
              </button>
              <button
                onClick={() => {
                  setShowNewTicketForm(false);
                  setNewTicketForm({ subject: "", content: "", priority: "medium" });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoadingTickets ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">در حال بارگذاری...</p>
        </div>
      ) : tickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(ticket.status)}`}>
                    {getTicketStatusText(ticket.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </span>
                </div>
                
                <h4 className="font-bold text-white truncate">{ticket.subject}</h4>
                
                <div className="text-xs text-white/70">
                  <span className="font-mono">#{ticket._id.slice(-8)}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <FaComments className="text-xs" />
                    <span>{ticket.messages.length} پیام</span>
                  </div>
                  <span>{new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <FaTicketAlt className="text-4xl text-white/30 mx-auto" />
          </div>
          <p className="text-lg text-white/80 mb-4">شما هنوز تیکتی ندارید.</p>
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors"
          >
            <FaPlus className="text-sm" />
            اولین تیکت خود را ایجاد کنید
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketSystem;