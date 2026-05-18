"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { FieldSchema } from "@/lib/types";

const Icons = {
  Couple: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 2h-6c-1.1 0-2 .9-2 2v5h2v-5h2v5h2v-5h2v-5c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  Event: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.45 7.55L22 12l-7.55 2.45L12 22l-2.45-7.55L2 12l7.55-2.45L12 2z" />
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm9-8h-3.17L16 2H8L6.17 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Error: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  Music: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Add: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Gift: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  ),
  Warning: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

function InvitationFormContent({ initialData }: { initialData?: any }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const initialTab = searchParams.get("tab") || "mempelai";

  const supabase = createClient();
  const [data, setData] = useState<any>(initialData || null);
  const [formData, setFormData] = useState<Record<string, any>>(initialData?.content || {});
  const parseAccountsForForm = (content: any) => {
    if (Array.isArray(content?.bank_accounts) && content.bank_accounts.length > 0) {
      return content.bank_accounts.map((acc: any) => {
        if (!acc) return null;
        let b = acc.bank || "";
        let n = acc.number || "";
        let nm = acc.name || "";
        if (b && (b.includes("–") || b.includes("—") || (b.includes("-") && b.length > 15))) {
          const parts = b.split(/\s*[-–—]\s*/).map((s: string) => s.trim());
          b = parts[0] || "BCA";
          n = parts[1] || n;
          nm = parts[2] || nm;
        }
        return { bank: b, number: n, name: nm };
      }).filter((acc: any) => acc && (acc.bank || acc.number || acc.name));
    }
    const accs: Array<{ bank: string, number: string, name: string }> = [];
    if (content?.bank_account_1) {
      const parts = content.bank_account_1.split(/\s*[-–—]\s*/).map((s: string) => s.trim());
      accs.push({ bank: parts[0] || "BCA", number: parts[1] || "", name: parts[2] || "" });
    }
    if (content?.bank_account_2) {
      const parts = content.bank_account_2.split(/\s*[-–—]\s*/).map((s: string) => s.trim());
      accs.push({ bank: parts[0] || "BCA", number: parts[1] || "", name: parts[2] || "" });
    }
    if (accs.length === 0) {
      accs.push({ bank: "BCA", number: "", name: "" });
    }
    return accs;
  };

  const [bankAccounts, setBankAccounts] = useState<Array<{ bank: string, number: string, name: string }>>(() => {
    return parseAccountsForForm(initialData?.content);
  });
  const [loveStory, setLoveStory] = useState<Array<{ date: string, title: string, description: string }>>(() => {
    return Array.isArray(initialData?.content?.love_story) ? initialData.content.love_story : [];
  });
  const [loading, setLoading] = useState(!initialData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [pendingNav, setPendingNav] = useState<{ type: "tab" | "link", target: string } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasChanges = () => {
    if (!isEditing || !initialSnapshot) return false;
    const currentSnapshot = JSON.stringify({ ...formData, bank_accounts: bankAccounts, love_story: loveStory });
    return currentSnapshot !== initialSnapshot;
  };

  const handleTabClick = (tabId: string) => {
    if (activeTab === tabId) return;
    if (hasChanges()) {
      setPendingNav({ type: "tab", target: tabId });
      return;
    }
    setIsEditing(false);
    setActiveTab(tabId);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      
      const href = target.getAttribute("href");
      if (href && !href.startsWith("#") && !target.hasAttribute("download")) {
        if (hasChanges()) {
          e.preventDefault();
          e.stopPropagation();
          setPendingNav({ type: "link", target: href });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleClick, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, [isEditing, formData, bankAccounts, loveStory, initialSnapshot]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  useEffect(() => {
    if (initialTab && initialTab !== "pengaturan") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      const initialContent = initialData.content || {};
      const parsedAccs = parseAccountsForForm(initialContent);
      setBankAccounts(parsedAccs);
      const initialStory = Array.isArray(initialContent.love_story) ? initialContent.love_story : [];
      setLoveStory(initialStory);
      setFormData({
        ...initialContent,
        bank_accounts: parsedAccs,
        bank_account_1: parsedAccs[0] && (parsedAccs[0].number || parsedAccs[0].name) ? `${parsedAccs[0].bank} — ${parsedAccs[0].number} — ${parsedAccs[0].name}` : "",
        bank_account_2: parsedAccs[1] && (parsedAccs[1].number || parsedAccs[1].name) ? `${parsedAccs[1].bank} — ${parsedAccs[1].number} — ${parsedAccs[1].name}` : "",
      });
      setInitialSnapshot(JSON.stringify({ ...initialContent, bank_accounts: parsedAccs, love_story: initialStory }));
      setLoading(false);
      return;
    }

    async function loadData() {
      if (!orderId) return;

      const { data: invData } = await supabase
        .from('invitations')
        .select('*, orders(*, templates(*))')
        .eq('order_id', orderId)
        .single();

      if (invData) {
        setData(invData);
        const invContent = invData.content || {};
        const parsedAccs = parseAccountsForForm(invContent);
        setBankAccounts(parsedAccs);
        const invStory = Array.isArray(invContent.love_story) ? invContent.love_story : [];
        setLoveStory(invStory);
        setFormData({
          ...invContent,
          bank_accounts: parsedAccs,
          bank_account_1: parsedAccs[0] && (parsedAccs[0].number || parsedAccs[0].name) ? `${parsedAccs[0].bank} — ${parsedAccs[0].number} — ${parsedAccs[0].name}` : "",
          bank_account_2: parsedAccs[1] && (parsedAccs[1].number || parsedAccs[1].name) ? `${parsedAccs[1].bank} — ${parsedAccs[1].number} — ${parsedAccs[1].name}` : "",
        });
        setInitialSnapshot(JSON.stringify({ ...invContent, bank_accounts: parsedAccs, love_story: invStory }));
      }
      setLoading(false);
    }
    loadData();
  }, [supabase, orderId, initialData]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data?.id) return false;

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/invitations/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to save");
      }

      setSaveStatus("success");
      setData((prev: any) => prev ? ({ ...prev, content: formData }) : null);
      setInitialSnapshot(JSON.stringify({ ...formData, bank_accounts: bankAccounts, love_story: loveStory }));
      setIsEditing(false);
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 4000);
      return true;
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 5000);
      return false;
    }
  };

  const handleFilesUpload = async (key: string, fileList: FileList | File[], isMulti = false) => {
    if (!data?.id || !isEditing) return;

    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploadingField(key);

    const maxAllowed = isMulti ? Math.max(0, 16 - (formData[key] || []).length) : 1;
    const filesToUpload = files.slice(0, maxAllowed);

    if (filesToUpload.length === 0) {
      setUploadingField(null);
      return;
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const originalFile = filesToUpload[i];
      let file = originalFile;

      if (originalFile.type.startsWith("image/")) {
        file = await new Promise<File>((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(originalFile);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1920;
            const MAX_HEIGHT = 1920;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
              if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(originalFile);
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
              if (blob && blob.type === "image/avif") {
                resolve(new File([blob], originalFile.name.replace(/\.[^/.]+$/, "") + ".avif", { type: "image/avif" }));
              } else {
                canvas.toBlob((webpBlob) => {
                  if (webpBlob) {
                    resolve(new File([webpBlob], originalFile.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }));
                  } else resolve(originalFile);
                }, "image/webp", 0.95);
              }
            }, "image/avif", 0.95);
          };
          img.onerror = () => resolve(originalFile);
        });
      }

      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${data.id}/${key}-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("path", filePath);

        const response = await fetch("/api/invitations/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          console.error("Upload failed for:", file.name, errData);
          continue;
        }

        const { publicUrl } = await response.json();
        uploadedUrls.push(publicUrl);
      } catch (error: any) {
        console.error("Upload error for:", file.name, error);
      }
    }

    if (uploadedUrls.length > 0) {
      if (isMulti) {
        setFormData(prev => ({
          ...prev,
          [key]: [...(prev[key] || []), ...uploadedUrls],
        }));
      } else {
        handleInputChange(key, uploadedUrls[0]);
      }
    } else {
      alert("Gagal mengunggah file.");
    }

    setUploadingField(null);
  };

  const removeFile = (key: string, index?: number) => {
    if (!isEditing) return;
    if (index !== undefined) {
      const currentFiles = [...(formData[key] || [])];
      currentFiles.splice(index, 1);
      handleInputChange(key, currentFiles);
    } else {
      handleInputChange(key, null);
    }
  };

  const order = data?.orders;
  const template = Array.isArray(order?.templates) ? order.templates[0] : order?.templates;
  const baseFieldSchema = template?.field_schema || [];
  const fieldSchema = [...baseFieldSchema];
  if (!fieldSchema.some((f: any) => f.key === "music_url")) {
    fieldSchema.push({
      key: "music_url",
      label: "File Audio Latar Musik (MP3/WAV)",
      type: "file",
      accept: "audio/*",
      required: true,
      hint: "Unggah file musik MP3/WAV untuk diputar otomatis sebagai lagu latar saat undangan dibuka.",
    });
  }

  const musicFields = fieldSchema.filter((f: any) => f.key === 'music_url' || f.key === 'music' || f.accept?.includes('audio'));
  const mediaFields = fieldSchema.filter((f: any) => (f.type === 'file' || f.type === 'multi_file' || f.type === 'image' || f.type === 'gallery') && !musicFields.includes(f));
  const groomBrideFields = fieldSchema.filter((f: any) => (f.key.startsWith('groom') || f.key.startsWith('bride')) && !mediaFields.includes(f) && !musicFields.includes(f));
  const eventFields = fieldSchema.filter((f: any) => (f.key.startsWith('akad') || f.key.startsWith('reception') || f.key.includes('maps') || f.key.includes('date')) && !mediaFields.includes(f) && !musicFields.includes(f));
  const otherFields = fieldSchema.filter((f: any) => !groomBrideFields.includes(f) && !eventFields.includes(f) && !mediaFields.includes(f) && !musicFields.includes(f));

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const BANK_OPTIONS = [
    "BCA", "BCA Syariah", "Bank Mandiri", "BNI", "BRI", "BSI (Bank Syariah Indonesia)",
    "CIMB Niaga", "CIMB Niaga Syariah", "Bank Permata", "Bank Danamon", "Bank Jago",
    "SeaBank", "Blu by BCA Digital", "Jenius (BTPN)", "Bank Mega", "Bank BTN",
    "GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"
  ];

  const handleBankAccountChange = (index: number, field: 'bank' | 'number' | 'name', val: string) => {
    const newAccs = [...bankAccounts];
    newAccs[index] = { ...newAccs[index], [field]: val };
    setBankAccounts(newAccs);

    const updatedFormData = {
      ...formData,
      bank_accounts: newAccs,
      bank_account_1: newAccs[0] && (newAccs[0].number || newAccs[0].name) ? `${newAccs[0].bank} — ${newAccs[0].number} — ${newAccs[0].name}` : "",
      bank_account_2: newAccs[1] && (newAccs[1].number || newAccs[1].name) ? `${newAccs[1].bank} — ${newAccs[1].number} — ${newAccs[1].name}` : "",
    };
    setFormData(updatedFormData);
  };

  const addBankAccount = () => {
    if (!isEditing) return;
    const newAccs = [...bankAccounts, { bank: "BCA", number: "", name: "" }];
    setBankAccounts(newAccs);
    setFormData(prev => ({
      ...prev,
      bank_accounts: newAccs,
    }));
    setTimeout(() => {
      const el = document.getElementById(`bank-account-${newAccs.length - 1}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const input = el.querySelector("input");
        if (input) input.focus({ preventScroll: true });
      }
    }, 50);
  };

  const removeBankAccount = (index: number) => {
    if (!isEditing) return;
    const newAccs = bankAccounts.filter((_, i) => i !== index);
    if (newAccs.length === 0) newAccs.push({ bank: "BCA", number: "", name: "" });
    setBankAccounts(newAccs);
    setFormData(prev => ({
      ...prev,
      bank_accounts: newAccs,
      bank_account_1: newAccs[0] ? `${newAccs[0].bank} — ${newAccs[0].number} — ${newAccs[0].name}` : "",
      bank_account_2: newAccs[1] ? `${newAccs[1].bank} — ${newAccs[1].number} — ${newAccs[1].name}` : "",
    }));
  };

  const handleLoveStoryChange = (index: number, field: "date" | "title" | "description", value: string) => {
    if (!isEditing) return;
    const newStory = [...loveStory];
    newStory[index] = { ...newStory[index], [field]: value };
    setLoveStory(newStory);
    setFormData(prev => ({ ...prev, love_story: newStory }));
  };

  const addLoveStoryItem = () => {
    if (!isEditing) return;
    const newStory = [...loveStory, { date: "", title: "", description: "" }];
    setLoveStory(newStory);
    setFormData(prev => ({ ...prev, love_story: newStory }));
    setTimeout(() => {
      const el = document.getElementById(`love-story-${newStory.length - 1}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        const input = el.querySelector("input");
        if (input) input.focus({ preventScroll: true });
      }
    }, 50);
  };

  const removeLoveStoryItem = (index: number) => {
    if (!isEditing) return;
    const newStory = loveStory.filter((_, i) => i !== index);
    setLoveStory(newStory);
    setFormData(prev => ({ ...prev, love_story: newStory }));
  };

  const commonClasses = "w-full px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-white font-bold text-charcoal-900 placeholder:text-slate-300 text-sm transition-all shadow-xs";

  const renderField = (field: FieldSchema) => {

    if (field.type === "file" || field.type === "multi_file" || field.type === "image" || field.type === "gallery") {
      const isMulti = field.type === "multi_file" || field.type === "gallery";
      const value = formData[field.key];

      return (
        <div key={field.key} className="space-y-2 col-span-full pt-4 border-t border-slate-100/80 first:border-0 first:pt-0">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider">
              {field.accept?.includes("audio") || field.key.includes("music") ? "File Audio" : isMulti ? "Maksimal 16 Foto" : "1 Foto"}
            </span>
          </div>

          <div className={isMulti ? "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1" : "flex flex-wrap items-center gap-4 pt-1"}>
            {isMulti ? (
              (value || []).map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/img border border-slate-200 shadow-sm bg-white">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {isEditing && (
                    <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(field.key, idx)}
                        className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all shadow-md transform active:scale-95 cursor-pointer"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              value && (
                field.accept?.includes("audio") || field.key.includes("music") ? (
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs w-full max-w-md">
                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                      <Icons.Music />
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <div className="text-xs font-bold text-charcoal-900 truncate mb-1">Audio Musik Terunggah</div>
                      <audio controls src={value} className="w-full h-8" />
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeFile(field.key)}
                        className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        <Icons.Trash />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden group/img border border-slate-200 shadow-sm bg-white shrink-0">
                    <img src={value} alt="" className="w-full h-full object-cover" />
                    {isEditing && (
                      <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeFile(field.key)}
                          className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-md transform active:scale-95 cursor-pointer"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    )}
                  </div>
                )
              )
            )}

            {(isEditing || (!isMulti && !value) || (isMulti && (!value || value.length === 0))) && (!isMulti || (value || []).length < 16) && (
              <label className={`${isMulti ? 'aspect-square rounded-xl' : 'w-32 h-32 sm:w-36 sm:h-36 rounded-2xl'} border-2 flex flex-col items-center justify-center transition-all group/upload shrink-0 ${!isEditing ? 'border-slate-200 bg-slate-100/80 opacity-60 cursor-not-allowed pointer-events-none shadow-none' : 'border-dashed border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 cursor-pointer shadow-inner'} ${uploadingField === field.key ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                  type="file"
                  disabled={!isEditing}
                  className="hidden"
                  multiple={isMulti}
                  accept={field.accept || "image/jpeg, image/png, image/webp, image/avif, image/heic"}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesUpload(field.key, e.target.files, isMulti);
                    }
                  }}
                />
                {uploadingField === field.key ? (
                  <div className="w-5 h-5 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <div className={`mb-1 transform group-hover/upload:-translate-y-0.5 transition-transform ${!isEditing ? 'text-slate-400' : 'text-rose-500'}`}><Icons.Upload /></div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${!isEditing ? 'text-slate-400' : 'text-rose-500'} text-center px-1`}>
                      {field.accept?.includes("audio") || field.key.includes("music")
                        ? (value ? "Ganti Musik" : "Pilih Musik")
                        : isMulti
                          ? "+ Tambah Foto"
                          : (value ? "Ganti Foto" : "Pilih Foto")}
                    </span>
                  </>
                )}
              </label>
            )}
          </div>
          {field.hint && <p className="text-[10px] text-slate-400 font-medium">{field.hint}</p>}
        </div>
      );
    }

    return (
      <div key={field.key} className={`space-y-1.5 ${field.type === 'textarea' ? 'col-span-full' : ''}`}>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          {field.label}
          {field.required && <span className="text-rose-500">*</span>}
        </label>

        {field.type === "textarea" ? (
          <textarea
            disabled={!isEditing}
            className={`${commonClasses} min-h-[100px] resize-y ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
            required={field.required}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder || "Tuliskan di sini..."}
          />
        ) : (
          <input
            type={field.type}
            disabled={!isEditing}
            className={`${commonClasses} ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
            required={field.required}
            placeholder={field.placeholder || field.hint}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        )}
        {field.hint && <p className="text-[10px] text-slate-400 font-medium">{field.hint}</p>}
      </div>
    );
  };

  const renderHeaderActions = () => (
    <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
      {!isEditing ? (
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
            const currentContent = data?.content || initialData?.content || {};
            const parsedAccs = parseAccountsForForm(currentContent);
            const currentStory = Array.isArray(currentContent.love_story) ? currentContent.love_story : [];
            setInitialSnapshot(JSON.stringify({ ...currentContent, bank_accounts: parsedAccs, love_story: currentStory }));
          }}
          className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer transform active:scale-95"
        >
          <Icons.Edit />
          <span>Edit Data</span>
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              const cancelContent = data?.content || initialData?.content || {};
              setFormData(cancelContent);
              setBankAccounts(parseAccountsForForm(cancelContent));
              setLoveStory(Array.isArray(cancelContent.love_story) ? cancelContent.love_story : []);
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer transform active:scale-95"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saveStatus === "saving" || !data?.id}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer transform active:scale-95"
          >
            {saveStatus === "saving" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Icons.Check />
            )}
            <span>Simpan</span>
          </button>
        </>
      )}
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-full">
      <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-2xl shadow-charcoal-900/[0.04] border border-slate-100/80 overflow-hidden h-full relative">
        {/* CUSTOM CONFIRMATION MODAL OVERLAY */}
        {pendingNav && (
          <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] p-6 max-w-sm w-full shadow-2xl border border-rose-100/50 space-y-5 text-center animate-scale-up">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                <Icons.Warning />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal-900 mb-1">Perubahan Belum Disimpan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ada perubahan data yang belum disimpan. Yakin ingin membuang perubahan ini dan pindah halaman?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    const cancelContent = data?.content || initialData?.content || {};
                    setFormData(cancelContent);
                    setBankAccounts(parseAccountsForForm(cancelContent));
                    setLoveStory(Array.isArray(cancelContent.love_story) ? cancelContent.love_story : []);
                    
                    if (pendingNav.type === "tab") {
                      setActiveTab(pendingNav.target);
                    } else {
                      router.push(pendingNav.target);
                    }
                    setPendingNav(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Abaikan
                </button>
                <button
                  type="button"
                  disabled={saveStatus === "saving"}
                  onClick={async () => {
                    const navTo = pendingNav;
                    const success = await handleSubmit();
                    if (success) {
                      setPendingNav(null);
                      if (navTo?.type === "tab") {
                        setActiveTab(navTo.target);
                      } else if (navTo?.type === "link") {
                        router.push(navTo.target);
                      }
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] uppercase tracking-wider transition-colors shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saveStatus === "saving" ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : null}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Sidebar Tabs */}
      <div className="lg:w-80 shrink-0 bg-slate-50/60 border-b lg:border-b-0 lg:border-r border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-y-auto custom-scrollbar p-6 gap-3">
        <div className="hidden lg:flex items-center gap-3.5 px-4 pb-6 mb-4 border-b border-slate-200/60 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 shrink-0">
            <Icons.Couple />
          </div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-lg leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>Data Pernikahan</h3>
          </div>
        </div>

        {[
          { id: "mempelai", label: "Profil Mempelai", desc: "Nama & Orang Tua", icon: <Icons.Couple /> },
          { id: "acara", label: "Waktu & Lokasi", desc: "Akad & Resepsi", icon: <Icons.Event /> },
          { id: "lainnya", label: "Info Lainnya", desc: "Ayat, Kisah, Rekening", icon: <Icons.Sparkles /> },
          { id: "media", label: "Foto & Galeri", desc: "Prewedding & Dokumentasi", icon: <Icons.Camera /> },
          { id: "musik", label: "Latar Musik", desc: "Audio Autoplay", icon: <Icons.Music /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`group relative flex items-center gap-4 px-6 py-4 transition-all duration-300 rounded-[24px] text-left shrink-0 lg:shrink-0 w-full ${activeTab === tab.id
              ? "bg-rose-500 text-white shadow-xl shadow-rose-500/25 font-bold"
              : "bg-white/60 hover:bg-white text-slate-400 hover:text-charcoal-900 border border-slate-100 shadow-xs"
              }`}
          >
            <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:text-rose-500"}`}>
              {tab.icon}
            </div>
            <div>
              <div className="text-xs md:text-sm font-black uppercase tracking-wider">{tab.label}</div>
              <div className={`text-[10px] font-semibold mt-0.5 ${activeTab === tab.id ? "text-rose-100" : "text-slate-400"}`}>{tab.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto custom-scrollbar relative">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
          {/* FLOATING TOAST NOTIFICATIONS */}
          {saveStatus === "success" && (
            <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-charcoal-900 text-white rounded-2xl shadow-2xl shadow-charcoal-900/30 border border-slate-800 text-xs font-bold tracking-wider uppercase animate-fade-in">
              <div className="w-6 h-6 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0"><Icons.Check /></div>
              <span>Perubahan Tersimpan</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-rose-600 text-white rounded-2xl shadow-2xl shadow-rose-600/30 text-xs font-bold tracking-wider uppercase animate-fade-in">
              <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><Icons.Error /></div>
              <span>{errorMessage || "Gagal Menyimpan. Silakan Coba Lagi."}</span>
            </div>
          )}

          {activeTab === "mempelai" && (
            <div className="animate-fade-in pb-12">
              <div className="sticky top-0 z-30 px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shadow-2xs">
                <div>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 1 / 5</span>
                  <h2 className="text-2xl md:text-3xl font-black text-charcoal-900 mt-1 mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Profil Mempelai</h2>
                  <p className="text-sm text-slate-400 font-medium">Lengkapi data diri dan nama orang tua mempelai.</p>
                </div>
                {renderHeaderActions()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 lg:px-10">
                {groomBrideFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "acara" && (
            <div className="animate-fade-in pb-12">
              <div className="sticky top-0 z-30 px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shadow-2xs">
                <div>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 2 / 5</span>
                  <h2 className="text-2xl md:text-3xl font-black text-charcoal-900 mt-1 mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Waktu & Lokasi Acara</h2>
                  <p className="text-sm text-slate-400 font-medium">Tentukan jadwal dan lokasi pelaksanaan akad serta resepsi.</p>
                </div>
                {renderHeaderActions()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-6 lg:px-10">
                {eventFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "lainnya" && (
            <div className="animate-fade-in pb-12">
              <div className="sticky top-0 z-30 px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shadow-2xs">
                <div>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 3 / 5</span>
                  <h2 className="text-2xl md:text-3xl font-black text-charcoal-900 mt-1 mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Info Lainnya</h2>
                  <p className="text-sm text-slate-400 font-medium">Kelola kutipan ayat, kisah cinta, rekening kado, dan alamat pengiriman.</p>
                </div>
                {renderHeaderActions()}
              </div>

              <div className="space-y-8 px-6 lg:px-10">
                {/* 1. Ayat / Kutipan Cinta */}
                <div className="space-y-1.5 col-span-full">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      Kutipan / Ayat Suci / Quote
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider">Opsional</span>
                  </div>
                  <textarea
                    disabled={!isEditing}
                    value={formData.love_quote || ""}
                    onChange={(e) => handleInputChange("love_quote", e.target.value)}
                    placeholder="Contoh: Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu... (QS. Ar-Rum: 21)"
                    className={`${commonClasses} min-h-[140px] resize-y ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Ayat Al-Quran, hadits, puisi, atau kata-kata mutiara pengantar undangan.</p>
                </div>

                {/* 2. Kisah & Perjalanan Cinta (Love Story) */}
                <div className="space-y-5 pt-6 border-t border-slate-100/80 col-span-full">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      Kisah / Perjalanan Cinta (Love Story)
                    </label>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={addLoveStoryItem}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Icons.Add /> Tambah Cerita
                      </button>
                    )}
                  </div>

                  {loveStory.length === 0 ? (
                    <div className="text-center py-10 px-6 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                      <p className="text-slate-400 text-xs font-medium">Belum ada kisah cinta yang ditambahkan.</p>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={addLoveStoryItem}
                          className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Icons.Add /> Mulai Tulis Kisah Cinta
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {loveStory.map((story, index) => (
                        <div key={index} id={`love-story-${index}`} className="space-y-4 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0 relative group">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-wider text-rose-500">
                              Momen #{index + 1}
                            </span>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => removeLoveStoryItem(index)}
                                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                                title="Hapus Momen"
                              >
                                <Icons.Trash />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Waktu / Tanggal
                              </label>
                              <input
                                type="text"
                                disabled={!isEditing}
                                value={story.date || ""}
                                onChange={(e) => handleLoveStoryChange(index, "date", e.target.value)}
                                placeholder="Contoh: Januari 2020 atau 15 Juni 2022"
                                className={`${commonClasses} ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Judul Momen
                              </label>
                              <input
                                type="text"
                                disabled={!isEditing}
                                value={story.title || ""}
                                onChange={(e) => handleLoveStoryChange(index, "title", e.target.value)}
                                placeholder="Contoh: Pertama Bertemu atau Lamaran"
                                className={`${commonClasses} ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              Deskripsi Cerita
                            </label>
                            <textarea
                              disabled={!isEditing}
                              value={story.description || ""}
                              onChange={(e) => handleLoveStoryChange(index, "description", e.target.value)}
                              placeholder="Ceritakan momen singkat kebahagiaan kalian di saat tersebut..."
                              className={`${commonClasses} min-h-[100px] resize-y ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Daftar Rekening & Kado Digital */}
                <div className="space-y-5 pt-6 border-t border-slate-100/80">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      Nomor Rekening & E-Wallet (Kado Digital)
                    </label>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={addBankAccount}
                        className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Icons.Add /> Tambah Rekening
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {bankAccounts.map((acc, index) => (
                      <div key={index} id={`bank-account-${index}`} className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative group">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            Bank / E-Wallet #{index + 1}
                          </label>
                          <select
                            disabled={!isEditing}
                            value={acc.bank || "BCA"}
                            onChange={(e) => handleBankAccountChange(index, "bank", e.target.value)}
                            className={`${commonClasses} ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                          >
                            {BANK_OPTIONS.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            Nomor Rekening / HP #{index + 1}
                          </label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={acc.number || ""}
                            onChange={(e) => handleBankAccountChange(index, "number", e.target.value)}
                            placeholder="Contoh: 1234567890"
                            className={`${commonClasses} font-mono ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              Atas Nama Pemilik #{index + 1}
                            </label>
                            {isEditing && bankAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBankAccount(index)}
                                className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                                title="Hapus Rekening"
                              >
                                <Icons.Trash />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={acc.name || ""}
                            onChange={(e) => handleBankAccountChange(index, "name", e.target.value)}
                            placeholder="Contoh: Fahmi Afrizal"
                            className={`${commonClasses} ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Alamat Pengiriman Kado Fisik */}
                <div className="space-y-1.5 pt-6 border-t border-slate-100/80 col-span-full">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      Alamat Pengiriman Kado Fisik
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider">Opsional</span>
                  </div>
                  <textarea
                    disabled={!isEditing}
                    value={formData.gift_address || ""}
                    onChange={(e) => handleInputChange("gift_address", e.target.value)}
                    placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kec. Kebayoran Baru, Jakarta Selatan 12190"
                    className={`${commonClasses} min-h-[100px] resize-y ${!isEditing ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200/60 shadow-none select-none opacity-60' : ''}`}
                  />
                </div>

                {/* Sisa input otherFields */}
                {otherFields.filter(f => !["love_quote", "bank_account_1", "bank_account_2", "gift_address"].includes(f.key)).length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-slate-100/80">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100/80">
                      Kolom Tambahan Lainnya
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {otherFields.filter(f => !["love_quote", "bank_account_1", "bank_account_2", "gift_address"].includes(f.key)).map(renderField)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="animate-fade-in pb-12">
              <div className="sticky top-0 z-30 px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shadow-2xs">
                <div>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 4 / 5</span>
                  <h2 className="text-2xl md:text-3xl font-black text-charcoal-900 mt-1 mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Foto & Galeri</h2>
                  <p className="text-sm text-slate-400 font-medium">Unggah koleksi foto prewedding terbaik untuk galeri undangan.</p>
                </div>
                {renderHeaderActions()}
              </div>

              <div className="grid grid-cols-1 gap-5 px-6 lg:px-10">
                {mediaFields.length > 0 ? (
                  mediaFields.map(renderField)
                ) : (
                  <div className="text-center py-16 px-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                      <Icons.Camera />
                    </div>
                    <h3 className="font-bold text-charcoal-900 text-lg md:text-xl" style={{ fontFamily: "var(--font-playfair)" }}>Galeri Tidak Diperlukan</h3>
                    <p className="text-slate-500 text-xs mt-2 font-medium max-w-md mx-auto leading-relaxed">
                      Desain template undangan yang Anda pilih bernuansa minimalis elegan dan tidak menggunakan galeri foto eksternal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "musik" && (
            <div className="animate-fade-in pb-12">
              <div className="sticky top-0 z-30 px-6 lg:px-10 pt-6 lg:pt-8 pb-4 bg-slate-50 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shadow-2xs">
                <div>
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 5 / 5</span>
                  <h2 className="text-2xl md:text-3xl font-black text-charcoal-900 mt-1 mb-1 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Latar Musik</h2>
                  <p className="text-sm text-slate-400 font-medium">Kelola file audio untuk latar musik otomatis undangan.</p>
                </div>
                {renderHeaderActions()}
              </div>
              <div className="grid grid-cols-1 gap-5 px-6 lg:px-10">
                {musicFields.map(renderField)}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
    </div>
  );
}

export default function InvitationForm({ initialData }: { initialData?: any }) {
  return (
    <div className="h-full">
      <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
        <InvitationFormContent initialData={initialData} />
      </Suspense>
    </div>
  );
}
