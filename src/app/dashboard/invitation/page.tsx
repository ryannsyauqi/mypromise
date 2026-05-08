import Navbar from "@/components/Navbar";
import InvitationForm from "./InvitationForm";

export default function EditInvitationPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Edit Konten Undangan
        </h1>
        <p className="text-charcoal-400 mt-2">Isi detail pernikahan Anda di bawah ini. Perubahan akan langsung terlihat di preview.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-cream-200 shadow-sm overflow-hidden">
        <InvitationForm />
      </div>
    </div>
  );
}
