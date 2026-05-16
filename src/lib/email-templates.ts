
const PINK_ACCENT = '#d4a7ae'; // Deepened pink for readability from globals.css
const PINK_BG = '#f6e6e9';     // Saturated pink-calm from globals.css
const TEXT_DARK = '#5a474b';   // Foreground from globals.css
const WHITE_CALM = '#faf8f8';  // White-calm from globals.css

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Li'L Caca";

export const getMerchantEmail = (order: any) => {
  const isDonation = order.type === 'donation';
  const shipping = order.shippingAddress || {};
  const itemsHtml = !isDonation && order.items ? order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; color: ${TEXT_DARK};">
        ${item.product?.name || 'Product'} <span style="color: ${PINK_ACCENT}; margin-left: 8px; font-weight: 600;">x${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; text-align: right; color: ${TEXT_DARK}; font-weight: 700;">
        ₱${(Number(item.priceAtPurchase || item.product?.price || 0) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') : '';

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${PINK_BG}; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background: ${WHITE_CALM}; border-top: 6px solid ${PINK_ACCENT}; padding: 48px; border-radius: 4px; box-shadow: 0 4px 30px rgba(90, 71, 75, 0.08);">
          <p style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 16px 0;">Internal Notification</p>
          <h1 style="font-size: 24px; color: ${TEXT_DARK}; margin: 0 0 32px 0; font-weight: 600; letter-spacing: -0.01em;">New ${isDonation ? 'Support Gift' : 'Sale'}</h1>
          
          <div style="margin-bottom: 40px; background: ${PINK_BG}; padding: 32px; border-radius: 4px; text-align: center;">
            <p style="font-size: 11px; color: ${TEXT_DARK}; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 8px 0; opacity: 0.7;">Total Revenue</p>
            <p style="font-size: 36px; color: ${TEXT_DARK}; margin: 0; font-weight: 700;">₱${order.totalAmount?.toLocaleString()}</p>
          </div>

          <div style="margin-bottom: 32px; border-bottom: 1px solid ${PINK_BG}; padding-bottom: 24px;">
            <h2 style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 16px 0;">Customer</h2>
            <p style="font-size: 15px; color: ${TEXT_DARK}; margin: 0 0 4px 0; font-weight: 600;">${order.customerName}</p>
            <p style="font-size: 14px; color: ${TEXT_DARK}; margin: 0 0 4px 0; opacity: 0.8;">${order.email}</p>
            ${order.phoneNumber ? `<p style="font-size: 14px; color: ${TEXT_DARK}; margin: 0; opacity: 0.8;">${order.phoneNumber}</p>` : ''}
          </div>

          ${!isDonation ? `
          <div style="margin-bottom: 32px; border-bottom: 1px solid ${PINK_BG}; padding-bottom: 24px;">
            <h2 style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 16px 0;">Shipping To</h2>
            <p style="font-size: 14px; color: ${TEXT_DARK}; line-height: 1.7; margin: 0; opacity: 0.9;">
              ${shipping.street || shipping.address || 'Address not found'}<br>
              ${shipping.city}, ${shipping.province} ${shipping.zip}
            </p>
          </div>
          ` : ''}

          ${itemsHtml ? `
          <div>
            <h2 style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 16px 0;">Items List</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
          </div>
          ` : ''}

          <div style="margin-top: 64px; text-align: center; border-top: 2px solid ${PINK_BG}; padding-top: 32px;">
            <p style="font-size: 10px; color: ${TEXT_DARK}; opacity: 0.4; margin: 0; letter-spacing: 0.05em;">ORDER ID: ${order.id}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const getCustomerEmail = (order: any) => {
  const isDonation = order.type === 'donation';
  const shipping = order.shippingAddress || {};
  const itemsHtml = !isDonation && order.items ? order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; color: ${TEXT_DARK};">
        ${item.product?.name || 'Product'} <span style="color: ${PINK_ACCENT}; margin-left: 8px; font-weight: 600;">x${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; text-align: right; color: ${TEXT_DARK}; font-weight: 700;">
        ₱${(Number(item.priceAtPurchase || item.product?.price || 0) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('') : (isDonation ? `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; color: ${TEXT_DARK};">
        Support Gift
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid ${PINK_BG}; font-size: 14px; text-align: right; color: ${TEXT_DARK}; font-weight: 700;">
        ₱${order.totalAmount?.toLocaleString()}
      </td>
    </tr>
  ` : '');

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${PINK_BG}; margin: 0; padding: 40px 20px;">
        <div style="max-width: 560px; margin: 0 auto; background: ${WHITE_CALM}; border-top: 6px solid ${PINK_ACCENT}; padding: 64px 48px; border-radius: 4px; box-shadow: 0 4px 30px rgba(90, 71, 75, 0.08);">
          <div style="text-align: center; margin-bottom: 64px;">
            <p style="font-size: 15px; letter-spacing: 0.5em; font-weight: 400; color: ${TEXT_DARK}; text-transform: uppercase; margin: 0;">${SITE_NAME}</p>
          </div>

          <h1 style="font-size: 32px; color: ${TEXT_DARK}; margin: 0 0 24px 0; font-weight: 400; letter-spacing: -0.03em; text-align: center;">
            ${isDonation ? 'A Heartfelt Thank You' : 'Order Confirmed'}
          </h1>
          
          <p style="font-size: 16px; color: ${TEXT_DARK}; line-height: 1.8; margin: 0 0 48px 0; opacity: 0.8; text-align: center; font-weight: 300;">
            ${isDonation 
              ? `Hi ${order.customerName}! Thank you so much for your gift. It really helps me keep making art.` 
              : `Hi ${order.customerName}! Thanks for your order. I am so happy you like my work. I will pack it for you now!`}
          </p>

          <div style="background: ${PINK_BG}; padding: 40px; border-radius: 4px; margin-bottom: 48px;">
            <h2 style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 24px 0; text-align: center;">${isDonation ? 'Gift Details' : 'Selection Summary'}</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              ${itemsHtml}
            </table>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 2px solid ${PINK_ACCENT};">
              <span style="font-size: 13px; color: ${TEXT_DARK}; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Total</span>
              <span style="font-size: 24px; text-align: right; color: ${TEXT_DARK}; font-weight: 700;">₱${order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          ${!isDonation ? `
          <div style="margin-bottom: 64px; text-align: center;">
            <h2 style="font-size: 11px; font-weight: 700; color: ${PINK_ACCENT}; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 16px 0;">Arriving At</h2>
            <p style="font-size: 14px; color: ${TEXT_DARK}; line-height: 1.8; margin: 0; opacity: 0.9;">
              ${order.customerName}<br>
              ${shipping.street || shipping.address || 'Address not found'}<br>
              ${shipping.city}, ${shipping.province} ${shipping.zip}
            </p>
          </div>
          ` : ''}

          <div style="margin-top: 64px; text-align: center; border-top: 1px solid ${PINK_BG}; padding-top: 48px;">
            <p style="font-size: 14px; color: ${TEXT_DARK}; font-style: italic; margin: 0 0 32px 0; opacity: 0.7;">
              "Every item is special. Thank you for being part of the story."
            </p>
            <p style="font-size: 10px; color: ${TEXT_DARK}; text-transform: uppercase; letter-spacing: 0.3em; margin: 0; opacity: 0.4; font-weight: 600;">
              &copy; 2026 ${SITE_NAME.toUpperCase()}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};
