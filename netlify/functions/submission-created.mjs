// Parte da sola a ogni iscrizione verificata dei moduli Netlify (evento «submission-created»).
// Copia il contatto nella lista Brevo, così i lead restano in un elenco email vero (oltre che in Netlify → Forms).
// Finché in Netlify non ci sono BREVO_API_KEY e BREVO_LIST_ID non fa niente: il modulo funziona lo stesso.
export const handler = async (event) => {
  const key = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!key || !listId) return { statusCode: 200, body: 'Brevo non configurato' };

  const { payload } = JSON.parse(event.body || '{}');
  const d = payload?.data || {};
  const email = (d.email || payload?.email || '').trim().toLowerCase();
  if (!email || d.consenso !== 'si') return { statusCode: 200, body: 'nessun consenso' };

  const invia = (attributes) => fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ email, listIds: [listId], updateEnabled: true, attributes }),
  });
  // Gli attributi INSTAGRAM, FONTE e CONSENSO vanno creati in Brevo (Contatti → Impostazioni → Attributi).
  let r = await invia({
    INSTAGRAM: (d.instagram || '').replace(/^@/, ''),
    FONTE: payload?.form_name || 'checklist',
    CONSENSO: `checkbox privacy ${payload?.created_at || new Date().toISOString()}`,
  });
  // Se gli attributi non esistono ancora, salva almeno l'email.
  if (!r.ok) { console.error('Brevo', r.status, await r.text()); r = await invia({}); }
  if (!r.ok) console.error('Brevo senza attributi', r.status, await r.text());
  return { statusCode: 200, body: 'ok' };
};
