require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const { Resend } = require('resend');
const multer = require('multer');

// Configuração do Multer (mantém os arquivos em memória)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
const port = process.env.PORT || 3000;
// Inicializa o Resend de forma segura para não travar o servidor se a chave faltar
const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder_123';
const resend = new Resend(resendApiKey);

// Inicializa o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder'
);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// ROTAS DA API
// ==========================================

// Rota para Inscrição na Newsletter (Front-end)
app.post('/api/subscribe', async (req, res) => {
    const { name, email, whatsapp } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
    }

    const { data, error } = await supabase
        .from('subscribers')
        .insert([{ name, email, whatsapp }])
        .select();

    if (error) {
        if (error.code === '23505') { // Violação de UNIQUE no Postgres
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
    }

    res.status(201).json({ message: 'Inscrição realizada com sucesso!', id: data[0].id });
});

// Rota de Login para o Admin
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ error: 'Senha incorreta.' });
    }
});

// ==========================================
// ROTAS DE AGENDA
// ==========================================

// Obter toda a agenda (Público)
app.get('/api/agenda', async (req, res) => {
    const { data, error } = await supabase.from('agenda').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: 'Erro ao buscar agenda.' });
    res.json({ agenda: data });
});

// Adicionar item na agenda (Admin)
app.post('/api/admin/agenda', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { event, city, date } = req.body;
    if (!event || !city || !date) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    const { data, error } = await supabase.from('agenda').insert([{ event, city, date }]).select();
    if (error) return res.status(500).json({ error: 'Erro ao salvar na agenda.' });
    res.status(201).json({ message: 'Agenda adicionada!', id: data[0].id });
});

// Deletar item da agenda (Admin)
app.delete('/api/admin/agenda/:id', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { error } = await supabase.from('agenda').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: 'Erro ao deletar.' });
    res.json({ message: 'Deletado com sucesso.' });
});

// ==========================================
// ROTAS DE VÍDEOS
// ==========================================

// Obter vídeos (Público)
app.get('/api/videos', async (req, res) => {
    const { data, error } = await supabase.from('videos').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: 'Erro ao buscar vídeos.' });
    res.json({ videos: data });
});

// Adicionar vídeo (Admin)
app.post('/api/admin/videos', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { url, type } = req.body;
    if (!url || !type) return res.status(400).json({ error: 'URL e tipo são obrigatórios.' });

    const { data, error } = await supabase.from('videos').insert([{ url, type }]).select();
    if (error) return res.status(500).json({ error: 'Erro ao salvar vídeo.' });
    res.status(201).json({ message: 'Vídeo adicionado!', id: data[0].id });
});

// Deletar vídeo (Admin)
app.delete('/api/admin/videos/:id', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { error } = await supabase.from('videos').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: 'Erro ao deletar.' });
    res.json({ message: 'Deletado com sucesso.' });
});

// ==========================================
// ROTAS DE CONFIGURAÇÕES GERAIS (BIO, INSTA)
// ==========================================

// Obter configurações (Público)
app.get('/api/settings', async (req, res) => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) return res.status(500).json({ error: 'Erro ao buscar configurações.' });
    
    const settingsObj = {};
    data.forEach(row => {
        settingsObj[row.key] = row.value;
    });
    
    res.json({ settings: settingsObj });
});

// Salvar múltiplas configurações (Admin)
app.post('/api/admin/settings', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const upsertData = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from('settings').upsert(upsertData, { onConflict: 'key' });

    if (error) return res.status(500).json({ error: 'Erro ao salvar configurações.' });
    res.json({ message: 'Configurações salvas com sucesso!' });
});

// ==========================================
// ROTAS DA GALERIA DE EVENTOS (Salva em Settings JSON)
// ==========================================

// Rota para Upload de Imagens no Supabase Storage
app.post('/api/admin/upload', upload.array('files', 20), async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
        // Gera um nome único para evitar conflitos
        const fileName = `${Date.now()}_${Math.round(Math.random() * 1E9)}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        
        const { data, error } = await supabase.storage
            .from('gallery')
            .upload(`events/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Erro no upload para o Supabase:', error);
            return res.status(500).json({ error: 'Erro ao fazer upload da imagem.', details: error });
        }

        const publicUrlData = supabase.storage.from('gallery').getPublicUrl(data.path);
        uploadedUrls.push(publicUrlData.data.publicUrl);
    }

    res.json({ urls: uploadedUrls });
});

app.get('/api/events_gallery', async (req, res) => {
    const { data, error } = await supabase.from('settings').select('*').eq('key', 'events_gallery');
    if (error) return res.status(500).json({ error: 'Erro ao buscar galeria.' });
    
    let events = [];
    if (data && data.length > 0 && data[0].value) {
        try {
            events = JSON.parse(data[0].value);
        } catch(e) {
            events = [];
        }
    }
    res.json({ events });
});

app.post('/api/admin/events_gallery', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { title, location, image_url, album_urls } = req.body;
    if (!title || !location || !image_url) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    // 1. Buscar array existente
    const { data: get_data } = await supabase.from('settings').select('value').eq('key', 'events_gallery');
    let events = [];
    if (get_data && get_data.length > 0 && get_data[0].value) {
        try { events = JSON.parse(get_data[0].value); } catch(e) {}
    }

    // 2. Adicionar novo evento
    const newEvent = {
        id: Date.now().toString(), // ID único baseado em timestamp
        title,
        location,
        image_url,
        album_urls: album_urls || []
    };
    events.push(newEvent);

    // 3. Salvar array atualizado
    const { error } = await supabase.from('settings').upsert([{ key: 'events_gallery', value: JSON.stringify(events) }], { onConflict: 'key' });
    if (error) return res.status(500).json({ error: 'Erro ao salvar evento na galeria.' });
    
    res.status(201).json({ message: 'Evento adicionado com sucesso!', event: newEvent });
});

app.delete('/api/admin/events_gallery/:id', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { id } = req.params;

    const { data: get_data } = await supabase.from('settings').select('value').eq('key', 'events_gallery');
    if (!get_data || get_data.length === 0) return res.status(404).json({ error: 'Galeria vazia.' });

    let events = [];
    try { events = JSON.parse(get_data[0].value); } catch(e) {}

    const updatedEvents = events.filter(e => e.id !== id);

    const { error } = await supabase.from('settings').update({ value: JSON.stringify(updatedEvents) }).eq('key', 'events_gallery');
    if (error) return res.status(500).json({ error: 'Erro ao deletar evento.' });
    
    res.json({ message: 'Evento deletado com sucesso!' });
});

app.delete('/api/admin/events_gallery/:id/image', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) return res.status(400).json({ error: 'URL da imagem é obrigatória.' });

    const { data: get_data } = await supabase.from('settings').select('value').eq('key', 'events_gallery');
    if (!get_data || get_data.length === 0) return res.status(404).json({ error: 'Galeria vazia.' });

    let events = [];
    try { events = JSON.parse(get_data[0].value); } catch(e) {}

    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return res.status(404).json({ error: 'Evento não encontrado.' });

    const ev = events[eventIndex];
    let changed = false;

    // Se for a capa
    if (ev.image_url === imageUrl) {
        if (ev.album_urls && ev.album_urls.length > 0) {
            // Promove a primeira foto do album para capa
            ev.image_url = ev.album_urls.shift();
        } else {
            ev.image_url = ''; // Fica sem capa
        }
        changed = true;
    } 
    // Se for foto do álbum
    else if (ev.album_urls && ev.album_urls.includes(imageUrl)) {
        ev.album_urls = ev.album_urls.filter(url => url !== imageUrl);
        changed = true;
    }

    if (!changed) return res.status(404).json({ error: 'Imagem não encontrada neste evento.' });

    const { error } = await supabase.from('settings').update({ value: JSON.stringify(events) }).eq('key', 'events_gallery');
    if (error) return res.status(500).json({ error: 'Erro ao atualizar evento.' });
    
    res.json({ message: 'Imagem removida com sucesso!' });
});

// ==========================================
// ROTA PARA INSCRITOS E E-MAILS
// ==========================================

// Rota para Listar Inscritos (Admin)
app.get('/api/admin/subscribers', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { data, error } = await supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false });
    if (error) return res.status(500).json({ error: 'Erro ao buscar inscritos.' });
    res.json({ subscribers: data });
});

// Rota para Enviar E-mail (Admin)
app.post('/api/admin/broadcast', async (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { subject, messageHtml } = req.body;
    if (!subject || !messageHtml) {
        return res.status(400).json({ error: 'Assunto e mensagem são obrigatórios.' });
    }

    const { data: rows, error } = await supabase.from('subscribers').select('name, email');
    if (error) return res.status(500).json({ error: 'Erro no banco.' });
    if (!rows || rows.length === 0) return res.status(400).json({ error: 'Nenhum inscrito para enviar.' });

    let successCount = 0;
    let failCount = 0;

    const artistName = process.env.ARTIST_NAME || 'Keoma';
    const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

    for (const user of rows) {
        try {
            await resend.emails.send({
                from: `${artistName} <${senderEmail}>`,
                to: user.email,
                subject: subject,
                html: `<p>Olá ${user.name},</p>${messageHtml}`
            });
            successCount++;
        } catch (err) {
            console.error('Erro ao enviar para', user.email, err);
            failCount++;
        }
    }

    res.json({ message: 'Envio concluído', successCount, failCount });
});

// Vercel serverless export ou escutar localmente
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Servidor local rodando em http://localhost:${port}`);
    });
}
module.exports = app;
