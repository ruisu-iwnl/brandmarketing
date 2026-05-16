
export const getMerchantEmail = (order: any) => {
  const isDonation = order.type === 'donation';
  const itemsHtml = !isDonation && order.items ? order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #FDF2F8; font-size: 14px; color: #1F2937;">
        ${item.product?.name || 'Product'} x ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #FDF2F8; font-size: 14px; text-align: right; color: #1F2937; font-weight: 600;">
        ₱${(Number(item.priceAtPurchase || item.product?.price || 0) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #FDF2F8; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.05); }
          .header { text-align: center; margin-bottom: 40px; }
          .badge { display: inline-block; padding: 6px 12px; background: #FDF2F8; color: #EC4899; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 100px; margin-bottom: 16px; }
          .title { font-size: 24px; font-weight: 600; color: #111827; margin: 0; letter-spacing: -0.02em; }
          .amount-card { background: #FDF2F8; padding: 32px; border-radius: 16px; text-align: center; margin: 32px 0; border: 1px solid #FBCFE8; }
          .amount-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #EC4899; font-weight: 700; margin-bottom: 8px; }
          .amount-value { font-size: 32px; font-weight: 600; color: #111827; margin: 0; }
          .details { margin-top: 40px; }
          .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #9CA3AF; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid #F3F4F6; padding-bottom: 8px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #9CA3AF; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Sales Notification</span>
            <h1 class="title">New ${isDonation ? 'Support Gift' : 'Order Paid'}</h1>
          </div>
          
          <div class="amount-card">
            <div class="amount-label">Total Amount</div>
            <div class="amount-value">₱${order.totalAmount?.toLocaleString()}</div>
          </div>

          <div class="details">
            <div class="section-title">Customer Details</div>
            <p style="font-size: 14px; margin: 4px 0; color: #374151;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="font-size: 14px; margin: 4px 0; color: #374151;"><strong>Email:</strong> ${order.email}</p>
            ${order.phone ? `<p style="font-size: 14px; margin: 4px 0; color: #374151;"><strong>Phone:</strong> ${order.phone}</p>` : ''}
            
            ${!isDonation ? `
            <div class="section-title" style="margin-top: 32px;">Shipping Address</div>
            <p style="font-size: 14px; color: #374151; line-height: 1.6;">
              ${order.shippingAddress?.address}<br>
              ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.zip}
            </p>
            ` : ''}

            ${itemsHtml ? `
            <div class="section-title" style="margin-top: 32px;">Order Items</div>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            ` : ''}
          </div>

          <div class="footer">
            Order ID: ${order.id}<br>
            Processed by PayMongo Webhook
          </div>
        </div>
      </body>
    </html>
  `;
};

export const getCustomerEmail = (order: any) => {
  const isDonation = order.type === 'donation';
  const itemsHtml = !isDonation && order.items ? order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #FDF2F8; font-size: 14px; color: #1F2937;">
        ${item.product?.name || 'Product'} x ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #FDF2F8; font-size: 14px; text-align: right; color: #1F2937; font-weight: 600;">
        ₱${(Number(item.priceAtPurchase || item.product?.price || 0) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #ffffff; margin: 0; padding: 40px 20px; color: #111827; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 60px; }
          .logo { font-size: 20px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.4em; color: #111827; margin-bottom: 40px; display: block; text-decoration: none; }
          .title { font-size: 32px; font-weight: 400; color: #111827; margin-bottom: 16px; letter-spacing: -0.03em; }
          .subtitle { font-size: 16px; color: #6B7280; line-height: 1.6; max-width: 400px; margin: 0 auto; }
          .order-card { margin-top: 60px; border-top: 1px solid #F3F4F6; padding-top: 40px; }
          .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #9CA3AF; font-weight: 700; margin-bottom: 24px; }
          .total-row { padding-top: 24px; margin-top: 12px; border-top: 1px solid #F3F4F6; display: flex; justify-content: space-between; }
          .footer { margin-top: 80px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 40px; }
          .social-links { margin-bottom: 24px; }
          .social-link { color: #EC4899; text-decoration: none; font-size: 12px; margin: 0 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
          .thank-you-note { font-size: 14px; color: #6B7280; line-height: 1.8; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo">LI'L CACA</span>
            <h1 class="title">${isDonation ? 'A Heartfelt Thank You' : 'Order Confirmed'}</h1>
            <p class="subtitle">
              ${isDonation 
                ? `Hi ${order.customerName}! Thank you so much for your gift. It really helps me keep making art.` 
                : `Hi ${order.customerName}! Thanks for your order. I am so happy you like my work. I will pack it for you now!`}
            </p>
          </div>

          <div class="order-card">
            <div class="section-title">Order Summary</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 24px 0 12px; font-size: 14px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.1em;">Total Amount</td>
                <td style="padding: 24px 0 12px; font-size: 20px; text-align: right; color: #111827; font-weight: 600;">₱${order.totalAmount?.toLocaleString()}</td>
              </tr>
            </table>

            ${!isDonation ? `
            <div style="margin-top: 40px; display: grid; grid-template-cols: 1fr 1fr; gap: 40px;">
              <div>
                <div class="section-title">Shipping To</div>
                <p style="font-size: 14px; color: #4B5563; line-height: 1.6; margin: 0;">
                  ${order.customerName}<br>
                  ${order.shippingAddress?.address}<br>
                  ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.zip}
                </p>
              </div>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">Instagram</a>
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">WhatsApp</a>
            </div>
            <p class="thank-you-note">
              "Every item is special. Thank you for being part of the story."
            </p>
            <p style="font-size: 10px; color: #9CA3AF; margin-top: 32px; text-transform: uppercase; letter-spacing: 0.2em;">
              &copy; 2026 LI'L CACA COLLECTION. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
