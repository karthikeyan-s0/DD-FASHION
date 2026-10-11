import { Product, CartItem } from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = "919894251098";
export const FORMATTED_PHONE_DISPLAY = "+91 98942 51098";

/**
 * Creates direct WhatsApp order enquiry link for an individual product
 */
export function buildProductWhatsAppUrl(
  product: Product,
  size?: string,
  color?: string,
  quantity: number = 1
): string {
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : '';
  
  const isPendingPrice = product.tags?.includes('pending-price') || product.description?.includes('Pending Price Confirmation');
  const priceDisplay = `₹${product.price.toLocaleString('en-IN')}${isPendingPrice ? ' (Pending Price Confirmation)' : ''}`;
  
  let msg = `*DD FASHION — ORDER ENQUIRY*\n\n`;
  msg += `Hello DD FASHION Team, I would like to enquire about purchasing the following garment:\n\n`;
  msg += `• *Product Name:* ${product.name}\n`;
  msg += `• *SKU / Identifier:* ${product.sku}\n`;
  msg += `• *Displayed Price:* ${priceDisplay}\n`;
  if (size) {
    msg += `• *Selected Size:* ${size === 'Pending Confirmation' ? 'Pending Confirmation (Please advise available sizes)' : size}\n`;
  }
  if (color) {
    msg += `• *Selected Colour:* ${color}\n`;
  }
  msg += `• *Quantity:* ${quantity}\n`;
  if (currentUrl) {
    msg += `• *Product Page:* ${currentUrl}\n`;
  }
  msg += `\n*Note:* This is an order enquiry. Please confirm product stock availability, delivery charges to my location, and payment details. Thank you!`;

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * Creates direct WhatsApp order enquiry link for multiple cart items
 */
export function buildCartWhatsAppUrl(items: CartItem[], subtotal: number): string {
  let msg = `*DD FASHION — SHOPPING BAG ORDER ENQUIRY*\n\n`;
  msg += `Hello DD FASHION Team, I would like to enquire about ordering the items currently in my shopping bag:\n\n`;
  
  items.forEach((item, index) => {
    const p = item.product;
    const parts = [
      `*${p.name}* (SKU: ${p.sku})`,
      item.size ? `Size: ${item.size}` : null,
      item.color ? `Colour: ${item.color}` : null,
      `Qty: ${item.quantity}`,
      `Price: ₹${p.price.toLocaleString('en-IN')}${item.quantity > 1 ? ' each' : ''}`
    ].filter(Boolean);

    msg += `${index + 1}. ${parts.join(' | ')}\n`;
  });

  msg += `\n• *Calculated Items Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n\n`;
  msg += `*Note:* This is an order enquiry. Please confirm current stock availability, applicable shipping charges, and preferred payment instructions. Thank you!`;

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/**
 * General customer care / styling inquiry WhatsApp link
 */
export function buildGeneralInquiryWhatsAppUrl(customText?: string): string {
  const text = customText || "Hello DD FASHION! I would like styling assistance and product advice from your South Indian boutique.";
  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
