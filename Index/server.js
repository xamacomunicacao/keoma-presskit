require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuração do Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve os arquivos estáticos (index.html, css, js)

// Configuração do Banco de Dados SQLite
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela se não existir
        db.run(`CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            whatsapp TEXT,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS agenda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event TEXT NOT NULL,
            city TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`);
    }
});

// ==========================================
// ROTAS DA API
// ==========================================

// Rota para Inscrição na Newsletter (Front-end)
app.post('/api/subscribe', (req, res) => {
    const { name, email, whatsapp } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
    }

    const sql = 'INSERT INTO subscribers (name, email, whatsapp) VALUES (?, ?, ?)';
    db.run(sql, [name, email, whatsapp], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            }
            return res.status(500).json({ error: 'Erro ao salvar no banco de dados.' });
        }
        res.status(201).json({ message: 'Inscrição realizada com sucesso!', id: this.lastID });
    });
});

// Rota de Login para o Admin
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        // Em um app real usaríamos JWT, mas aqui retornamos success para o painel de testes
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ error: 'Senha incorreta.' });
    }
});

// ==========================================
// ROTAS DE AGENDA
// ==========================================

// Obter toda a agenda (Público)
app.get('/api/agenda', (req, res) => {
    db.all('SELECT * FROM agenda ORDER BY id ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar agenda.' });
        res.json({ agenda: rows });
    });
});

// Adicionar item na agenda (Admin)
app.post('/api/admin/agenda', (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { event, city, date } = req.body;
    if (!event || !city || !date) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    db.run('INSERT INTO agenda (event, city, date) VALUES (?, ?, ?)', [event, city, date], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao salvar na agenda.' });
        res.status(201).json({ message: 'Agenda adicionada!', id: this.lastID });
    });
});

// Deletar item da agenda (Admin)
app.delete('/api/admin/agenda/:id', (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    db.run('DELETE FROM agenda WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao deletar.' });
        res.json({ message: 'Deletado com sucesso.' });
    });
});

// ==========================================
// ROTAS DE VÍDEOS
// ==========================================

// Obter vídeos (Público)
app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY id ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar vídeos.' });
        res.json({ videos: rows });
    });
});

// Adicionar vídeo (Admin)
app.post('/api/admin/videos', (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    const { url, type } = req.body;
    if (!url || !type) return res.status(400).json({ error: 'URL e tipo são obrigatórios.' });

    db.run('INSERT INTO videos (url, type) VALUES (?, ?)', [url, type], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao salvar vídeo.' });
        res.status(201).json({ message: 'Vídeo adicionado!', id: this.lastID });
    });
});

// Deletar vídeo (Admin)
app.delete('/api/admin/videos/:id', (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    db.run('DELETE FROM videos WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao deletar.' });
        res.json({ message: 'Deletado com sucesso.' });
    });
});

// ==========================================
// ROTAS DE CONFIGURAÇÕES GERAIS (BIO, INSTA)
// ==========================================

// Obter configurações (Público)
app.get('/api/settings', (req, res) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar configurações.' });
        
        // Transforma o array [{key: 'bio_pt', value: '...'}, ...] em um objeto {bio_pt: '...', ...}
        const settingsObj = {};
        rows.forEach(row => {
            settingsObj[row.key] = row.value;
        });
        
        res.json({ settings: settingsObj });
    });
});

// Salvar múltiplas configurações (Admin)
app.post('/api/admin/settings', (req, res) => {
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }
    
    const settings = req.body; // Espera { "bio_pt": "...", "instagram_url": "..." }
    if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ error: 'Dados inválidos.' });
    }

    // Iniciar uma transação para salvar todas as chaves
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        
        for (const [key, value] of Object.entries(settings)) {
            stmt.run([key, value]);
        }
        
        stmt.finalize();
        db.run('COMMIT', (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao salvar configurações.' });
            res.json({ message: 'Configurações salvas com sucesso!' });
        });
    });
});

// Rota para Listar Inscritos (Admin)
app.get('/api/admin/subscribers', (req, res) => {
    // Basic auth check (dummy)
    if (req.headers.authorization !== 'Bearer fake-jwt-token') {
        return res.status(401).json({ error: 'Não autorizado.' });
    }

    db.all('SELECT * FROM subscribers ORDER BY subscribed_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar inscritos.' });
        }
        res.json({ subscribers: rows });
    });
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

    // Busca todos os e-mails
    db.all('SELECT name, email FROM subscribers', [], async (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro no banco.' });
        if (rows.length === 0) return res.status(400).json({ error: 'Nenhum inscrito para enviar.' });

        // Monta o envio do Resend (para simplificar, enviaremos um loop, mas pode usar Audience do Resend)
        let successCount = 0;
        let failCount = 0;

        const artistName = process.env.ARTIST_NAME || 'Artista';
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        for (const user of rows) {
            try {
                // DICA: No plano gratuito do Resend, só é possível enviar DE um e-mail verificado
                // e PARA o e-mail de teste, a menos que adicione um domínio próprio.
                await resend.emails.send({
                    from: `${artistName} <${senderEmail}>`,
                    to: user.email,
                    subject: subject,
                    html: `<p>Olá ${user.name},</p>${messageHtml}`
                });
                successCount++;
            } catch (error) {
                console.error('Erro ao enviar para', user.email, error);
                failCount++;
            }
        }

        res.json({ message: 'Envio concluído', successCount, failCount });
    });
});

// Iniciar o Servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Painel Admin em http://localhost:${port}/admin.html`);
});
