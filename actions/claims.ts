'use server'

import { supabase } from '@/lib/supabase'
import { generateTrackingCode } from '@/lib/utils'
import { sendClaimCreatedNotification, sendClaimStatusUpdatedNotification } from '@/lib/email'

export async function createClaim(formData: FormData) {
  // 1. Datos personales
  const doc_type = formData.get('doc_type') as string;
  const doc_number = formData.get('doc_number') as string;
  const client_name = formData.get('client_name') as string;
  const address = formData.get('address') as string;
  const department = formData.get('department') as string;
  const province = formData.get('province') as string;
  const district = formData.get('district') as string;
  const phone = formData.get('phone') as string;
  const client_email = formData.get('client_email') as string;
  const is_minor = formData.get('is_minor') === 'on';

  // 2. Identificación del bien contratado
  const title = formData.get('title') as string; // Descripción del producto o servicio
  const claimed_amountStr = formData.get('claimed_amount') as string;
  const claimed_amount = claimed_amountStr ? parseFloat(claimed_amountStr) : null;

  // 3. Detalle de reclamación
  const claim_type = formData.get('claim_type') as string; // 'Reclamo' o 'Queja'
  const description = formData.get('description') as string; // Detalle (máx 700)
  const request_detail = formData.get('request_detail') as string; // Pedido (máx 700)
  const accept_privacy = formData.get('accept_privacy');

  if (!accept_privacy) {
    return { success: false, error: 'Debe aceptar la política de protección de datos personales.' };
  }

  if (!doc_type || !doc_number || !client_name || !client_email || !title || !description || !claim_type) {
    return { success: false, error: 'Por favor complete todos los campos obligatorios.' };
  }

  const tracking_code = generateTrackingCode();

  const { error } = await supabase
    .from('reclamos')
    .insert([
      {
        tracking_code,
        doc_type,
        doc_number,
        client_name,
        address,
        department,
        province,
        district,
        phone,
        client_email,
        is_minor,
        title,
        claimed_amount,
        claim_type,
        description,
        request_detail,
        status: 'Pendiente'
      }
    ]);

  if (error) {
    console.error('Error al insertar reclamo:', error);
    return { success: false, error: 'Hubo un error al registrar el reclamo. Intenta nuevamente.' };
  }

  // Enviar correos de notificación de creación (al cliente y al admin)
  await sendClaimCreatedNotification({
    tracking_code,
    client_name,
    client_email,
    title,
    claim_type
  });

  return { success: true, tracking_code };
}

export async function getClaimByTrackingCode(trackingCode: string) {
  if (!trackingCode || trackingCode.trim() === '') {
    return { success: false, error: 'Por favor ingrese un código de seguimiento.' };
  }

  const cleanCode = trackingCode.trim();

  const { data, error } = await supabase
    .from('reclamos')
    .select('*') // Selecciona todos los campos de la tabla
    .ilike('tracking_code', cleanCode)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: 'No se encontró ningún reclamo con ese código de seguimiento.' };
  }

  return { success: true, data };
}

// NUEVA FUNCIÓN: Actualizar estado y notificar por correo al cliente
export async function updateClaimStatus(trackingCode: string, newStatus: string) {
  const { data, error } = await supabase
    .from('reclamos')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('tracking_code', trackingCode)
    .select('client_name, client_email, title, status')
    .single();

  if (error || !data) {
    return { success: false, error: 'No se pudo actualizar el estado del reclamo.' };
  }

  // Enviar correo automático informando la actualización de estado
  await sendClaimStatusUpdatedNotification({
    tracking_code: trackingCode,
    client_name: data.client_name,
    client_email: data.client_email,
    status: newStatus,
    title: data.title
  });

  return { success: true };
}