import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Remitente corporativo verificado
const SENDER_EMAIL = 'Libro de Reclamaciones <gerencia@aurumlogistics.com.pe>';

// Correo de destino corporativo para notificaciones internas
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'gerencia@aurumlogistics.com.pe';

// 1. Notificación al crear el reclamo
export async function sendClaimCreatedNotification(claimData: {
  tracking_code: string;
  client_name: string;
  client_email: string;
  title: string;
  claim_type?: string;
}) {
  try {
    const claimType = claimData.claim_type ? claimData.claim_type.toLowerCase() : 'reclamo';
    const claimTypeCapitalized = claimData.claim_type || 'Reclamo';

    // A. Correo de confirmación al CLIENTE
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [claimData.client_email],
      replyTo: 'gerencia@aurumlogistics.com.pe',
      subject: `[${claimData.tracking_code}] Hemos recibido tu ${claimType}`,
      text: `Hola ${claimData.client_name}, hemos recibido tu ${claimType}. Tu código de seguimiento es: ${claimData.tracking_code}. Motivo: ${claimData.title}.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Hola, ${claimData.client_name}</h2>
          <p>Hemos registrado correctamente tu <strong>${claimType}</strong> en nuestro sistema.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Tu número de seguimiento único es:</p>
            <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; font-family: monospace; color: #1f2937;">${claimData.tracking_code}</p>
          </div>
          <p><strong>Motivo:</strong> ${claimData.title}</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Puedes consultar el estado de tu solicitud en cualquier momento ingresando este código en nuestra plataforma.</p>
        </div>
      `,
    });

    // B. Correo de alerta a la EMPRESA (gerencia@aurumlogistics.com.pe)
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: claimData.client_email,
      subject: `🚨 Nuevo ${claimTypeCapitalized} registrado: ${claimData.tracking_code}`,
      text: `Se ha generado un nuevo ${claimType}. Cliente: ${claimData.client_name} (${claimData.client_email}). Código: ${claimData.tracking_code}. Asunto: ${claimData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #dc2626;">Se ha generado un nuevo ${claimTypeCapitalized}</h3>
          <p><strong>Cliente:</strong> ${claimData.client_name} (${claimData.client_email})</p>
          <p><strong>Código:</strong> ${claimData.tracking_code}</p>
          <p><strong>Asunto:</strong> ${claimData.title}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error al enviar correos de creación:', error);
    return { success: false, error };
  }
}

// 2. Notificación cuando se actualiza el estado del reclamo
export async function sendClaimStatusUpdatedNotification(claimData: {
  tracking_code: string;
  client_name: string;
  client_email: string;
  status: string;
  title: string;
  claim_type?: string;
}) {
  try {
    const claimType = claimData.claim_type ? claimData.claim_type.toLowerCase() : 'solicitud';

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [claimData.client_email],
      replyTo: 'gerencia@aurumlogistics.com.pe', 
      subject: `[${claimData.tracking_code}] Actualización de estado: ${claimData.status}`,
      text: `Hola ${claimData.client_name}, te informamos que tu ${claimType} "${claimData.title}" ha cambiado al estado: ${claimData.status}. Código de seguimiento: ${claimData.tracking_code}.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Hola, ${claimData.client_name}</h2>
          <p>Te informamos que tu ${claimType} <strong>"${claimData.title}"</strong> ha cambiado de estado.</p>
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">Nuevo Estado:</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">${claimData.status}</p>
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Código de seguimiento: ${claimData.tracking_code}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo de actualización:', error);
    return { success: false, error };
  }
}