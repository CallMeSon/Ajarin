"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { sendMessage } from "@/app/actions/chat";
import { initiateCompletion, confirmCompletion } from "@/app/actions/matches";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Send, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  avatarUrl: string | null;
  role: string;
}

interface Message {
  id: number;
  matchId: number;
  senderId: number;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  sentAt: Date;
  sender: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
}

export default function ChatRoom({
  matchId,
  currentUser,
  partner,
  requestTitle,
  initialMessages,
  matchStatus,
  validationInitiatedAt: initialValAt,
}: {
  matchId: number;
  currentUser: User;
  partner: Omit<User, "role">;
  requestTitle: string;
  initialMessages: any[];
  matchStatus: string;
  validationInitiatedAt: string | null;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [valAt, setValAt] = useState<string | null>(initialValAt);

  const [isPending, startTransition] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time Supabase Subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          // Hindari duplikasi jika pengirim adalah user ini
          if (newMsg.sender_id === currentUser.id) return;

          const mappedMsg: Message = {
            id: newMsg.id,
            matchId: newMsg.match_id,
            senderId: newMsg.sender_id,
            content: newMsg.content,
            fileUrl: newMsg.file_url,
            fileName: newMsg.file_name,
            sentAt: new Date(newMsg.sent_at),
            sender: {
              id: partner.id,
              name: partner.name,
              avatarUrl: partner.avatarUrl,
            },
          };

          setMessages((prev) => [...prev, mappedMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, partner, currentUser.id]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText("");

    // Optimistic Update
    const tempId = Date.now();
    const optMsg: Message = {
      id: tempId,
      matchId,
      senderId: currentUser.id,
      content: textToSend,
      fileUrl: null,
      fileName: null,
      sentAt: new Date(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
      },
    };

    setMessages((prev) => [...prev, optMsg]);

    const res = await sendMessage(matchId, textToSend);
    if (!res.success) {
      // Rollback jika gagal
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 5 MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileNameStr = `${Date.now()}.${fileExt}`;
      const filePath = `${matchId}/${currentUser.id}/${fileNameStr}`;

      const { data, error } = await supabase.storage
        .from("chat-attachments")
        .upload(filePath, file);

      if (error) throw error;

      // Buat signed URL berdurasi 1 minggu
      const { data: signedData, error: signedError } = await supabase.storage
        .from("chat-attachments")
        .createSignedUrl(filePath, 7 * 24 * 60 * 60);

      if (signedError) throw signedError;

      const res = await sendMessage(matchId, null, signedData.signedUrl, file.name);

      if (res.success && res.message) {
        const newMsg: Message = {
          id: res.message.id,
          matchId,
          senderId: currentUser.id,
          content: null,
          fileUrl: signedData.signedUrl,
          fileName: file.name,
          sentAt: new Date(),
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
          },
        };
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal mengunggah file. Pastikan tipe file didukung (PDF/PNG/JPG).");
    } finally {
      setUploading(false);
    }
  };

  const handleInitiateComplete = () => {
    startTransition(async () => {
      const res = await initiateCompletion(matchId);
      if (res.success) {
        setValAt(new Date().toISOString());
        router.refresh();
      }
    });
  };

  const handleConfirmComplete = () => {
    startTransition(async () => {
      const res = await confirmCompletion(matchId);
      if (res.success) {
        router.refresh();
        router.push(`/reviews/new?matchId=${matchId}`);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* LEFT: Chat Section */}
      <div className="flex-1 flex flex-col bg-white border border-border/60 rounded-3xl overflow-hidden shadow-tinted h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/40 bg-[#fbfbfe] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={partner.avatarUrl ?? undefined} />
              <AvatarFallback>{partner.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-sm text-foreground">{partner.name}</h3>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{requestTitle}</p>
            </div>
          </div>
          <Badge variant={matchStatus === "selesai" ? "secondary" : "default"} className="capitalize">
            {matchStatus}
          </Badge>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fcfdff]">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <Avatar className="h-8 w-8 border border-primary/10">
                    <AvatarImage src={msg.sender.avatarUrl ?? undefined} />
                    <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-[#e6eeff] text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.content && <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>}
                  {msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-semibold underline text-[11px] truncate max-w-full hover:opacity-90"
                    >
                      📎 {msg.fileName || "Lampiran File"}
                    </a>
                  )}
                  <p className={`text-[9px] mt-1.5 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.sentAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        {matchStatus === "aktif" ? (
          <form onSubmit={handleSendText} className="p-4 border-t border-border/40 bg-[#fbfbfe] flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-border hover:bg-accent/40"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            </Button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis pesan..."
              className="flex-1 px-4 py-2.5 bg-[#f8f9ff] border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-xs"
            />
            <Button type="submit" size="icon" className="rounded-xl bg-primary hover:bg-primary-deep text-white shadow-md">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 border-t border-border/40">
            Sesi chat ditutup karena bimbingan telah selesai.
          </div>
        )}
      </div>

      {/* RIGHT: Action Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <Card className="border border-border/60 shadow-tinted rounded-3xl bg-white p-6">
          <CardTitle className="text-sm font-extrabold uppercase tracking-wider mb-4 text-foreground">
            Status Bimbingan
          </CardTitle>
          <CardDescription className="text-xs">
            Gunakan panel ini untuk menyepakati akhir dari sesi mentoring terukur.
          </CardDescription>

          <div className="mt-6 space-y-4">
            {matchStatus === "aktif" ? (
              <>
                {currentUser.role === "mentor" ? (
                  !valAt ? (
                    <Button
                      onClick={handleInitiateComplete}
                      disabled={isPending}
                      className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-deep text-white font-bold text-xs py-5"
                    >
                      {isPending ? "Memproses..." : "🏁 Validasi Sesi Selesai"}
                    </Button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold text-center animate-pulse">
                      Menunggu konfirmasi penyelesaian dari Mentee
                    </div>
                  )
                ) : (
                  /* MENTEE */
                  valAt ? (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground text-center">
                        Mentor telah menandai sesi bimbingan selesai. Konfirmasikan jika Anda setuju.
                      </p>
                      <Button
                        onClick={handleConfirmComplete}
                        disabled={isPending}
                        className="w-full rounded-xl bg-gradient-to-r from-secondary to-[#00573b] text-white font-bold text-xs py-5"
                      >
                        {isPending ? "Memproses..." : "✔ Konfirmasi Sesi Selesai"}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#f8f9ff] border border-border/40 text-muted-foreground text-xs text-center">
                      Mentoring sedang berjalan. Mentor dapat menandai selesai jika sesi pertemuan terpenuhi.
                    </div>
                  )
                )}
              </>
            ) : (
              <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary text-xs text-center flex items-center justify-center gap-2 font-bold">
                <CheckCircle className="h-4 w-4" /> Bimbingan Selesai
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
