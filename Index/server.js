require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Inicializa o Supabase (garanta que as variáveis estejam no .env ou Vercel)
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder'
);

app.use(cors());
app.use(express.json());

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
