import GuestList from "./GuestList";

export default function GuestsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
            Daftar Tamu
          </h1>
          <p className="text-charcoal-400 mt-2">Kelola tamu undangan dan pantau konfirmasi kehadiran mereka.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-cream-200 shadow-sm overflow-hidden">
        <GuestList />
      </div>
    </div>
  );
}
