/**
 * Email Templates for MyPromise
 * Premium, Responsive, and On-brand
 */

const APP_COLOR = "#f43f5e"; // Rose 500
const BG_COLOR = "#fafaf9"; // Stone 50
const TEXT_COLOR = "#1c1917"; // Stone 900

const baseLayout = (content: string) => `
  <div style="background-color: ${BG_COLOR}; padding: 40px 20px; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; color: ${TEXT_COLOR};">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 32px; overflow: hidden; shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="padding: 40px 40px 20px 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
          MyPromise <span style="color: ${APP_COLOR};">.</span>
        </h1>
        <p style="margin: 10px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #78716c; font-weight: 700;">Digital Wedding Invitation</p>
      </div>

      <!-- Content -->
      <div style="padding: 0 40px 40px 40px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="padding: 30px 40px; background-color: #1c1917; text-align: center;">
        <p style="margin: 0; color: #a8a29e; font-size: 12px;">Dibuat dengan cinta untuk hari bahagia kamu.</p>
        <div style="margin-top: 15px;">
          <a href="https://mypromise.id" style="color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700;">mypromise.id</a>
        </div>
      </div>
    </div>
    <div style="max-width: 600px; margin: 20px auto 0; text-align: center;">
      <p style="font-size: 11px; color: #a8a29e; line-height: 1.6;">
        Email ini dikirim secara otomatis oleh sistem MyPromise.<br>
        Jika kamu membutuhkan bantuan, silakan hubungi kami via WhatsApp.
      </p>
    </div>
  </div>
`;

export const getPendingPaymentEmail = (name: string, amount: string, checkoutUrl: string, orderNumber?: string) => baseLayout(`
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; padding: 12px; background-color: #fff1f2; border-radius: 16px; margin-bottom: 20px;">
      <img src="https://cdn-icons-png.flaticon.com/512/10705/10705886.png" width="40" height="40" alt="Pending" />
    </div>
    <h2 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3;">Hampir Selesai!<br>Lanjutkan Pembayaran Kamu.</h2>
  </div>
  
  <p style="font-size: 15px; line-height: 1.6; color: #44403c;">Halo <strong>${name}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6; color: #44403c;">Terima kasih sudah memilih MyPromise. Undangan impianmu tinggal selangkah lagi. Selesaikan pembayaran sebesar <strong>Rp ${amount}</strong> untuk mulai mengisi data undanganmu.</p>
  
  ${orderNumber ? `
  <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 20px; padding: 20px; margin: 35px 0 10px 0; text-align: left;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="color: #78716c; padding: 6px 0; font-family: sans-serif;">No. Pesanan:</td>
        <td style="text-align: right; font-weight: 700; color: #1c1917; font-family: sans-serif;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="color: #78716c; padding: 6px 0; font-family: sans-serif;">Total Tagihan:</td>
        <td style="text-align: right; font-weight: 700; color: #f43f5e; font-family: sans-serif;">Rp ${amount}</td>
      </tr>
    </table>
  </div>
  ` : ''}

  <div style="text-align: center; margin: 40px 0;">
    <a href="${checkoutUrl}" style="background-color: ${APP_COLOR}; color: #ffffff; padding: 18px 35px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);">Lanjutkan Pembayaran</a>
  </div>

  <div style="background-color: #fafaf9; border: 1px dashed #e7e5e4; border-radius: 20px; padding: 20px; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #78716c;">Abaikan email ini jika kamu sudah melakukan pembayaran.</p>
  </div>
`);

export const getSuccessPaymentEmail = (name: string, dashboardUrl: string, orderNumber?: string) => baseLayout(`
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; padding: 12px; background-color: #f0fdf4; border-radius: 16px; margin-bottom: 20px;">
      <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" width="40" height="40" alt="Success" />
    </div>
    <h2 style="margin: 0; font-size: 22px; font-weight: 800; line-height: 1.3;">Yippie! Pembayaran Berhasil 🎉</h2>
  </div>
  
  <p style="font-size: 15px; line-height: 1.6; color: #44403c;">Halo <strong>${name}</strong>,</p>
  <p style="font-size: 15px; line-height: 1.6; color: #44403c;">Pembayaran kamu sudah kami terima. Sekarang saatnya merangkai undangan pernikahanmu! Dashboard pribadi kamu sudah siap diakses.</p>
  
  ${orderNumber ? `
  <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 20px; padding: 20px; margin: 35px 0 10px 0; text-align: left;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="color: #78716c; padding: 6px 0; font-family: sans-serif;">No. Pesanan:</td>
        <td style="text-align: right; font-weight: 700; color: #1c1917; font-family: sans-serif;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="color: #78716c; padding: 6px 0; font-family: sans-serif;">Status Pembayaran:</td>
        <td style="text-align: right; font-weight: 700; color: #10b981; font-family: sans-serif;">LUNAS / BERHASIL</td>
      </tr>
    </table>
  </div>
  ` : ''}

  <div style="text-align: center; margin: 40px 0;">
    <a href="${dashboardUrl}" style="background-color: ${TEXT_COLOR}; color: #ffffff; padding: 18px 35px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);">Masuk ke Dashboard</a>
  </div>

  <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 20px; padding: 25px;">
    <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #92400e; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">PENTING: Simpan Link Ini</h4>
    <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">Simpan email ini baik-baik. Link di atas adalah akses utama kamu untuk mengedit data, melihat RSVP tamu, dan memantau ucapan kapan saja.</p>
  </div>
`);
