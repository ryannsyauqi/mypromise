import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const orderId = params.orderId;

  // Fetch data using Admin Client to bypass RLS for public access via UUID
  const supabase = createAdminClient();
  
  // 1. Get order first to ensure it exists
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*, templates(*)')
    .eq('id', orderId)
    .single();

  if (orderError || !orderData) {
    console.error("Dashboard: Order not found:", orderId, orderError);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900">Dashboard Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md">Maaf, kami tidak dapat menemukan data untuk pesanan ini. Pastikan link yang kamu buka sudah benar.</p>
        <Link href="/" className="px-8 py-3 bg-charcoal-900 text-white font-bold rounded-xl hover:bg-rose-500 transition-all">Kembali ke Beranda</Link>
      </div>
    );
  }

  // 1.5 Block access if order is not paid
  if (orderData.payment_status !== 'paid') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6 pt-24 pb-24 max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4 shadow-xl shadow-amber-500/5 border border-amber-100/50">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900">Akses Dashboard Dibatasi</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Kamu belum menyelesaikan pembayaran untuk pesanan ini. Silakan selesaikan pembayaran terlebih dahulu untuk dapat mengakses dashboard pengisian data undangan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href={`/checkout/${orderData.templates?.slug || ""}`}
            className="px-8 py-4 bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-600 transition-all duration-300 shadow-xl shadow-rose-900/10 flex items-center justify-center"
          >
            Ulangi Checkout
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-white text-slate-700 font-bold uppercase tracking-[0.15em] text-[10px] rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // 2. Get invitation
  let { data: invitationData, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('order_id', orderId)
    .single();

  // 3. Create invitation if it doesn't exist
  if (!invitationData) {
    console.warn("Dashboard: Invitation missing, creating on the fly for order:", orderId);
    
    // Generate a better default slug from names
    const slugify = (text: string) => text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const baseSlug = slugify(orderData.buyer_name || "undangan");
    let invitationSlug = orderData.inv_slug || baseSlug;

    // Check for existing slug and add suffix if needed if using baseSlug
    if (!orderData.inv_slug) {
      const { data: existingInvs } = await supabase
        .from('invitations')
        .select('slug')
        .ilike('slug', `${baseSlug}%`);

      if (existingInvs && existingInvs.length > 0) {
        invitationSlug = `${baseSlug}-${(existingInvs.length + 1).toString().padStart(3, '0')}`;
      }
    }
    
    const { data: newInv, error: createError } = await supabase.from('invitations').insert({
      order_id: orderId,
      slug: invitationSlug,
      template_id: orderData.template_id,
      content: {
        groom_name: "",
        bride_name: "",
      }
    }).select().single();

    if (createError) {
      console.error("Dashboard: Failed to create missing invitation:", createError);
    } else {
      invitationData = newInv;
    }
  }

  // 4. Get guests stats
  const { data: guestData } = await supabase
    .from('guests')
    .select('status')
    .eq('order_id', orderId);

  const initialData = {
    ...invitationData,
    orders: orderData,
    guests: guestData || []
  };

  return <DashboardClient initialData={initialData} orderId={orderId} />;
}
