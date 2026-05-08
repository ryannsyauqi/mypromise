export default function BillingPage() {
  const transactions = [
    { id: "MP-72182910", date: "8 Mei 2026", amount: 119000, status: "settlement", template: "Minimalist Elegance" },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Riwayat Pembayaran
        </h1>
        <p className="text-charcoal-400 mt-2">Pantau status transaksi dan tagihan Anda.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cream-100">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Order ID</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Tanggal</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Template</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Total</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-cream-50/30 transition-colors">
                  <td className="px-8 py-5 font-mono text-xs font-bold text-charcoal-600">{tx.id}</td>
                  <td className="px-8 py-5 text-sm text-charcoal-500">{tx.date}</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal-800">{tx.template}</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal-800">Rp {tx.amount.toLocaleString("id-ID")}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-sage-100 text-sage-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Lunas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
