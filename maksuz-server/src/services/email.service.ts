import nodemailer from "nodemailer";
import { env } from "../config/env";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified");
      return true;
    } catch (error) {
      console.error("❌ SMTP connection failed:", error);
      return false;
    }
  }

  /**
   * Send password reset email with 6-digit code
   */
  async sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
    const html = this.getPasswordResetTemplate(code);

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Resetovanje lozinke - Maksuz",
        html,
      });
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      return false;
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    firstName: string,
  ): Promise<boolean> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = this.getVerificationEmailTemplate(verificationUrl, firstName);

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: "Potvrdite vaš email - Maksuz",
        html,
      });
      console.log(`✅ Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send verification email:", error);
      return false;
    }
  }

  /**
   * Get styled HTML template for email verification
   */
  private getVerificationEmailTemplate(
    verificationUrl: string,
    firstName: string,
  ): string {
    const logoUrl = `${env.FRONTEND_URL}/maksuzorangelogo.png`;

    return `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrdite vaš email - Maksuz</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      background-color: #f6f6f7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }
    .brand-name {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .greeting {
      color: #18181b;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .title {
      color: #18181b;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .subtitle {
      color: #71717a;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .button-container {
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #f97316;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
    }
    .button:hover {
      background-color: #ea580c;
    }
    .expiry {
      color: #71717a;
      font-size: 13px;
      margin-bottom: 32px;
    }
    .expiry strong {
      color: #f97316;
    }
    .link-fallback {
      color: #a1a1aa;
      font-size: 12px;
      word-break: break-all;
      margin-bottom: 24px;
    }
    .divider {
      height: 1px;
      background-color: #e4e4e7;
      margin: 24px 0;
    }
    .footer-text {
      color: #a1a1aa;
      font-size: 12px;
      line-height: 1.8;
    }
    .footer {
      background-color: #fafafa;
      padding: 24px 30px;
      text-align: center;
    }
    .footer-brand {
      color: #71717a;
      font-size: 12px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div style="padding: 40px 20px; background-color: #f6f6f7;">
    <div class="container">
      <!-- Header with Logo -->
      <div class="header">
        <img src="${logoUrl}" alt="Maksuz" class="logo" />
        <div class="brand-name">Maksuz</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <p class="greeting">Pozdrav ${firstName}!</p>
        <h1 class="title">Potvrdite vaš email</h1>
        <p class="subtitle">
          Hvala vam što ste kreirali račun na Maksuz.<br />
          Kliknite dugme ispod da potvrdite vašu email adresu.
        </p>
        
        <!-- Button -->
        <div class="button-container">
          <a href="${verificationUrl}" class="button">Potvrdi email</a>
        </div>
        
        <p class="expiry">
          Ovaj link ističe za <strong>24 sata</strong>.
        </p>
        
        <p class="link-fallback">
          Ako dugme ne radi, kopirajte ovaj link u preglednik:<br />
          ${verificationUrl}
        </p>
        
        <div class="divider"></div>
        
        <p class="footer-text">
          Ako niste kreirali račun na Maksuz, slobodno ignorirajte ovaj email.
        </p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">
          © ${new Date().getFullYear()} Maksuz. Sva prava zadržana.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  /**
   * Send email change verification email
   */
  async sendEmailChangeVerification(
    newEmail: string,
    token: string,
    userName: string,
  ): Promise<boolean> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email-change?token=${token}`;
    const html = this.getEmailChangeTemplate(
      verificationUrl,
      userName,
      newEmail,
    );

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: newEmail,
        subject: "Potvrdite promjenu email adrese - Maksuz",
        html,
      });
      console.log(`✅ Email change verification sent to ${newEmail}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send email change verification:", error);
      return false;
    }
  }

  /**
   * Get styled HTML template for email change verification
   */
  private getEmailChangeTemplate(
    verificationUrl: string,
    userName: string,
    newEmail: string,
  ): string {
    const logoUrl = `${env.FRONTEND_URL}/maksuzorangelogo.png`;

    return `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrdite promjenu email adrese - Maksuz</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      background-color: #f6f6f7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }
    .brand-name {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .greeting {
      color: #18181b;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .title {
      color: #18181b;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .subtitle {
      color: #71717a;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .email-info {
      background-color: #f4f4f5;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .email-label {
      color: #71717a;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .email-value {
      color: #18181b;
      font-size: 16px;
      font-weight: 600;
    }
    .button-container {
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #f97316;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
    }
    .button:hover {
      background-color: #ea580c;
    }
    .expiry {
      color: #71717a;
      font-size: 13px;
      margin-bottom: 32px;
    }
    .expiry strong {
      color: #f97316;
    }
    .link-fallback {
      color: #a1a1aa;
      font-size: 12px;
      word-break: break-all;
      margin-bottom: 24px;
    }
    .divider {
      height: 1px;
      background-color: #e4e4e7;
      margin: 24px 0;
    }
    .footer-text {
      color: #a1a1aa;
      font-size: 12px;
      line-height: 1.8;
    }
    .footer {
      background-color: #fafafa;
      padding: 24px 30px;
      text-align: center;
    }
    .footer-brand {
      color: #71717a;
      font-size: 12px;
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin-bottom: 24px;
      text-align: left;
    }
    .warning-text {
      color: #92400e;
      font-size: 13px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div style="padding: 40px 20px; background-color: #f6f6f7;">
    <div class="container">
      <!-- Header with Logo -->
      <div class="header">
        <img src="${logoUrl}" alt="Maksuz" class="logo" />
        <div class="brand-name">Maksuz</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <p class="greeting">Pozdrav ${userName}!</p>
        <h1 class="title">Potvrdite novu email adresu</h1>
        <p class="subtitle">
          Zatražili ste promjenu email adrese na vašem Maksuz računu.
        </p>
        
        <!-- New Email Info -->
        <div class="email-info">
          <p class="email-label">Nova email adresa:</p>
          <p class="email-value">${newEmail}</p>
        </div>
        
        <!-- Warning -->
        <div class="warning">
          <p class="warning-text">
            <strong>Važno:</strong> Nakon potvrde, morat ćete koristiti novu email adresu za prijavu.
          </p>
        </div>
        
        <!-- Button -->
        <div class="button-container">
          <a href="${verificationUrl}" class="button">Potvrdi promjenu</a>
        </div>
        
        <p class="expiry">
          Ovaj link ističe za <strong>24 sata</strong>.
        </p>
        
        <p class="link-fallback">
          Ako dugme ne radi, kopirajte ovaj link u preglednik:<br />
          ${verificationUrl}
        </p>
        
        <div class="divider"></div>
        
        <p class="footer-text">
          Ako niste zatražili promjenu email adrese, ignorirajte ovaj email.<br />
          Vaša trenutna email adresa ostaje nepromijenjena.
        </p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">
          © ${new Date().getFullYear()} Maksuz. Sva prava zadržana.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmationToCustomer(
    email: string,
    order: {
      orderNumber: string;
      items: Array<{
        name: string;
        price: number;
        quantity: number;
        image?: string;
      }>;
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
      shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
      };
      paymentMethod: string;
      promoCode?: {
        code: string;
        discountAmount: number;
      };
      createdAt: Date;
    },
  ): Promise<boolean> {
    const html = this.getOrderConfirmationCustomerTemplate(order);

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: `Potvrda narudžbe #${order.orderNumber} - Maksuz`,
        html,
      });
      console.log(`✅ Order confirmation email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send order confirmation email:", error);
      return false;
    }
  }

  /**
   * Send new order notification to admin
   */
  async sendNewOrderNotificationToAdmin(
    order: {
      orderNumber: string;
      items: Array<{
        name: string;
        price: number;
        quantity: number;
        image?: string;
      }>;
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
      shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
      };
      paymentMethod: string;
      promoCode?: {
        code: string;
        discountAmount: number;
      };
      createdAt: Date;
    },
    customerEmail: string,
    customerName: string,
  ): Promise<boolean> {
    const html = this.getOrderNotificationAdminTemplate(
      order,
      customerEmail,
      customerName,
    );

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.ADMIN_EMAIL,
        subject: `Nova narudžba #${order.orderNumber} - ${order.total.toFixed(2)} KM`,
        html,
      });
      console.log(`✅ New order notification sent to admin`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send admin notification email:", error);
      return false;
    }
  }

  /**
   * Get styled HTML template for customer order confirmation
   */
  private getOrderConfirmationCustomerTemplate(order: {
    orderNumber: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      phone: string;
    };
    paymentMethod: string;
    promoCode?: {
      code: string;
      discountAmount: number;
    };
    createdAt: Date;
  }): string {
    const logoUrl = `${env.FRONTEND_URL}/maksuzorangelogo.png`;
    const trackingUrl = `${env.FRONTEND_URL}/shop/order/track?orderNumber=${order.orderNumber}`;
    const formattedDate = order.createdAt.toLocaleDateString("bs-BA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const paymentMethodLabel =
      order.paymentMethod === "cash"
        ? "Plaćanje pouzećem"
        : order.paymentMethod === "card"
          ? "Kartično plaćanje"
          : order.paymentMethod;

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e4e4e7;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />` : ""}
            <div>
              <p style="margin: 0; font-weight: 600; color: #18181b;">${item.name}</p>
              <p style="margin: 4px 0 0; color: #71717a; font-size: 13px;">Količina: ${item.quantity}</p>
            </div>
          </div>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e4e4e7; text-align: right; font-weight: 600; color: #18181b;">
          ${(item.price * item.quantity).toFixed(2)} KM
        </td>
      </tr>
    `,
      )
      .join("");

    return `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrda narudžbe - Maksuz</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f6f6f7;">
  <div style="padding: 40px 20px; background-color: #f6f6f7;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 40px 30px; text-align: center;">
        <img src="${logoUrl}" alt="Maksuz" style="width: 80px; height: 80px; margin-bottom: 16px;" />
        <div style="color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Maksuz</div>
      </div>

      <!-- Success Badge -->
      <div style="text-align: center; padding: 32px 30px 0;">
        <div style="display: inline-block; background-color: #dcfce7; border-radius: 50%; padding: 16px; margin-bottom: 16px;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 style="margin: 0; color: #18181b; font-size: 24px; font-weight: 600;">Hvala vam na narudžbi!</h1>
        <p style="margin: 8px 0 0; color: #71717a; font-size: 14px;">Vaša narudžba je uspješno zaprimljena.</p>
      </div>

      <!-- Order Number -->
      <div style="text-align: center; padding: 24px 30px;">
        <div style="background-color: #f4f4f5; border-radius: 12px; padding: 20px; display: inline-block;">
          <p style="margin: 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Broj narudžbe</p>
          <p style="margin: 8px 0 0; color: #f97316; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${order.orderNumber}</p>
        </div>
      </div>

      <!-- Order Items -->
      <div style="padding: 0 30px;">
        <h2 style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">Naručeni proizvodi</h2>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>
      </div>

      <!-- Order Summary -->
      <div style="padding: 24px 30px;">
        <div style="background-color: #fafafa; border-radius: 12px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
            <span style="color: #71717a;">Međuzbir: </span>
            <span style="color: #18181b; font-weight: 500;">${order.subtotal.toFixed(2)} KM</span>
          </div>
          ${
            order.promoCode
              ? `
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
            <span style="color: #16a34a;">Popust:  (${order.promoCode.code})</span>
            <span style="color: #16a34a; font-weight: 500;">-${order.promoCode.discountAmount.toFixed(2)} KM</span>
          </div>
          `
              : ""
          }
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
            <span style="color: #71717a;">Dostava: </span>
            <span style="color: #18181b; font-weight: 500;">${order.shipping === 0 ? "Besplatna" : order.shipping.toFixed(2) + " KM"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e4e4e7;">
            <span style="color: #71717a;">PDV: (17%)</span>
            <span style="color: #18181b; font-weight: 500;">${order.tax.toFixed(2)} KM</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 16px 0 8px; margin-top: 8px;">
            <span style="color: #18181b; font-size: 18px; font-weight: 600;">Ukupno: </span>
            <span style="color: #f97316; font-size: 24px; font-weight: 700;">${order.total.toFixed(2)} KM</span>
          </div>
        </div>
      </div>

      <!-- Shipping & Payment Info -->
      <div style="padding: 0 30px 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background-color: #f4f4f5; border-radius: 12px; padding: 16px;">
            <h3 style="margin: 0 0 12px; color: #18181b; font-size: 14px; font-weight: 600;">Adresa dostave</h3>
            <p style="margin: 0; color: #71717a; font-size: 13px; line-height: 1.6;">
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br />
              ${order.shippingAddress.street}<br />
              ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br />
              ${order.shippingAddress.country}<br />
              Tel: ${order.shippingAddress.phone}
            </p>
          </div>
          <div style="background-color: #f4f4f5; border-radius: 12px; padding: 16px;">
            <h3 style="margin: 0 0 12px; color: #18181b; font-size: 14px; font-weight: 600;">Način plaćanja</h3>
            <p style="margin: 0; color: #71717a; font-size: 13px;">${paymentMethodLabel}</p>
            <h3 style="margin: 16px 0 12px; color: #18181b; font-size: 14px; font-weight: 600;">Datum narudžbe</h3>
            <p style="margin: 0; color: #71717a; font-size: 13px;">${formattedDate}</p>
          </div>
        </div>
      </div>

      <!-- Track Order Button -->
      <div style="text-align: center; padding: 0 30px 32px;">
        <a href="${trackingUrl}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Pratite vašu narudžbu
        </a>
      </div>

      <!-- Info Note -->
      <div style="padding: 0 30px 24px;">
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px;">
          <p style="margin: 0; color: #92400e; font-size: 13px;">
            <strong>Napomena:</strong> Očekujte isporuku u roku od 2-5 radnih dana. Kontaktirat ćemo vas telefonom prije dostave.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #fafafa; padding: 24px 30px; text-align: center;">
        <p style="margin: 0; color: #71717a; font-size: 12px;">
          Imate pitanja? Kontaktirajte nas na info@maksuz.ba
        </p>
        <p style="margin: 8px 0 0; color: #71717a; font-size: 12px;">
          © ${new Date().getFullYear()} Maksuz. Sva prava zadržana.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  /**
   * Get styled HTML template for admin order notification
   */
  private getOrderNotificationAdminTemplate(
    order: {
      orderNumber: string;
      items: Array<{
        name: string;
        price: number;
        quantity: number;
        image?: string;
      }>;
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
      shippingAddress: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
      };
      paymentMethod: string;
      promoCode?: {
        code: string;
        discountAmount: number;
      };
      createdAt: Date;
    },
    customerEmail: string,
    customerName: string,
  ): string {
    const logoUrl = `${env.FRONTEND_URL}/maksuzorangelogo.png`;
    const adminOrderUrl = `${env.FRONTEND_URL}/admin/orders`;
    const formattedDate = order.createdAt.toLocaleDateString("bs-BA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const paymentMethodLabel =
      order.paymentMethod === "cash_on_delivery"
        ? "Plaćanje prilikom preuzimanja"
        : order.paymentMethod === "card"
          ? "Kartično plaćanje"
          : order.paymentMethod;

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7;">
          <p style="margin: 0; font-weight: 500; color: #18181b;">${item.name}</p>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; text-align: center; color: #71717a;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; text-align: right; color: #18181b;">
          ${item.price.toFixed(2)} KM
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; text-align: right; font-weight: 600; color: #18181b;">
          ${(item.price * item.quantity).toFixed(2)} KM
        </td>
      </tr>
    `,
      )
      .join("");

    return `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova narudžba - Maksuz Admin</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f6f6f7;">
  <div style="padding: 40px 20px; background-color: #f6f6f7;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 32px 30px; text-align: center;">
        <img src="${logoUrl}" alt="Maksuz" style="width: 60px; height: 60px; margin-bottom: 12px;" />
        <div style="color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 1px;">NOVA NARUDŽBA</div>
      </div>

      <!-- Order Summary Header -->
      <div style="padding: 24px 30px; background-color: #18181b; text-align: center;">
        <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Narudžba</p>
        <p style="margin: 8px 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 2px;">${order.orderNumber}</p>
        <p style="margin: 0; color: #f97316; font-size: 32px; font-weight: 700;">${order.total.toFixed(2)} KM</p>
      </div>

      <!-- Customer Info -->
      <div style="padding: 24px 30px; border-bottom: 1px solid #e4e4e7;">
        <h2 style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">Podaci o kupcu</h2>
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; color: #71717a; width: 120px;">Ime i prezime: </td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Email: </td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Telefon: </td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${order.shippingAddress.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Datum: </td>
            <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="padding: 24px 30px; border-bottom: 1px solid #e4e4e7;">
        <h2 style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">Adresa dostave</h2>
        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px;">
          <p style="margin: 0; color: #18181b; line-height: 1.8;">
            ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br />
            ${order.shippingAddress.street}<br />
            ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br />
            ${order.shippingAddress.country}
          </p>
        </div>
      </div>

      <!-- Order Items -->
      <div style="padding: 24px 30px; border-bottom: 1px solid #e4e4e7;">
        <h2 style="margin: 0 0 16px; color: #18181b; font-size: 16px; font-weight: 600;">Naručeni proizvodi</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f4f4f5;">
              <th style="padding: 12px; text-align: left; font-size: 12px; color: #71717a; text-transform: uppercase;">Proizvod</th>
              <th style="padding: 12px; text-align: center; font-size: 12px; color: #71717a; text-transform: uppercase;">Kol.</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; color: #71717a; text-transform: uppercase;">Cijena</th>
              <th style="padding: 12px; text-align: right; font-size: 12px; color: #71717a; text-transform: uppercase;">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Order Totals -->
      <div style="padding: 24px 30px;">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Međuzbir:</td>
            <td style="padding: 8px 0; text-align: right; color: #18181b;">${order.subtotal.toFixed(2)} KM</td>
          </tr>
          ${
            order.promoCode
              ? `
          <tr>
            <td style="padding: 8px 0; color: #16a34a;">Popust (${order.promoCode.code}):</td>
            <td style="padding: 8px 0; text-align: right; color: #16a34a;">-${order.promoCode.discountAmount.toFixed(2)} KM</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Dostava:</td>
            <td style="padding: 8px 0; text-align: right; color: #18181b;">${order.shipping === 0 ? "Besplatna" : order.shipping.toFixed(2) + " KM"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">PDV (17%):</td>
            <td style="padding: 8px 0; text-align: right; color: #18181b;">${order.tax.toFixed(2)} KM</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a;">Način plaćanja:</td>
            <td style="padding: 8px 0; text-align: right; color: #18181b; font-weight: 500;">${paymentMethodLabel}</td>
          </tr>
          <tr style="border-top: 2px solid #18181b;">
            <td style="padding: 16px 0 8px; color: #18181b; font-size: 18px; font-weight: 600;">UKUPNO:</td>
            <td style="padding: 16px 0 8px; text-align: right; color: #f97316; font-size: 24px; font-weight: 700;">${order.total.toFixed(2)} KM</td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; padding: 0 30px 32px;">
        <a href="${adminOrderUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Pregledaj narudžbe
        </a>
      </div>

      <!-- Footer -->
      <div style="background-color: #18181b; padding: 20px 30px; text-align: center;">
        <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
          Maksuz Admin Panel - Automatska obavijest o novoj narudžbi
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }

  /**
   * Get styled HTML template for password reset email
   */
  private getPasswordResetTemplate(code: string): string {
    const logoUrl = `${env.FRONTEND_URL}/maksuzorangelogo.png`;

    return `
<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resetovanje lozinke - Maksuz</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      background-color: #f6f6f7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 16px;
    }
    .brand-name {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .title {
      color: #18181b;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .subtitle {
      color: #71717a;
      font-size: 14px;
      margin-bottom: 32px;
    }
    .code-container {
      background-color: #f4f4f5;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .code-label {
      color: #f97316;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .code {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 12px;
      color: #18181b;
      font-family: 'Courier New', Courier, monospace;
    }
    .expiry {
      color: #71717a;
      font-size: 13px;
      margin-bottom: 32px;
    }
    .expiry strong {
      color: #f97316;
    }
    .divider {
      height: 1px;
      background-color: #e4e4e7;
      margin: 24px 0;
    }
    .footer-text {
      color: #a1a1aa;
      font-size: 12px;
      line-height: 1.8;
    }
    .footer {
      background-color: #fafafa;
      padding: 24px 30px;
      text-align: center;
    }
    .footer-brand {
      color: #71717a;
      font-size: 12px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 30px 20px;
      }
      .code {
        font-size: 32px;
        letter-spacing: 8px;
      }
    }
  </style>
</head>
<body>
  <div style="padding: 40px 20px; background-color: #f6f6f7;">
    <div class="container">
      <!-- Header with Logo -->
      <div class="header">
        <img src="${logoUrl}" alt="Maksuz" class="logo" />
        <div class="brand-name">Maksuz</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <h1 class="title">Resetovanje lozinke</h1>
        <p class="subtitle">
          Primili smo zahtjev za resetovanje lozinke vašeg računa.<br />
          Koristite kod ispod za nastavak.
        </p>
        
        <!-- Code Box -->
        <div class="code-container">
          <div class="code-label">Vaš verifikacijski kod</div>
          <div class="code">${code}</div>
        </div>
        
        <p class="expiry">
          Ovaj kod ističe za <strong>15 minuta</strong>.
        </p>
        
        <div class="divider"></div>
        
        <p class="footer-text">
          Ako niste zatražili resetovanje lozinke, slobodno ignorirajte ovaj email.<br />
          Vaš račun ostaje siguran.
        </p>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p class="footer-brand">
          © ${new Date().getFullYear()} Maksuz. Sva prava zadržana.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
  }
}

export const emailService = new EmailService();
