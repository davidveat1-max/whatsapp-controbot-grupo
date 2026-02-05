const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote'
    ],
    headless: true
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ BOT CONECTADO');
});


// ===== DELAY HUMANO =====

function humanDelay() {
  return Math.floor(Math.random() * 4000) + 2000;
}


// ===== COOLDOWN =====

const cooldown = new Map();
const COOLDOWN_MS = 15000;


// ===== COMANDOS =====

const comandos = {

"!ayuda": `
Comandos disponibles:
!nom059
!rechazo
!devolucion
!bitacora
!traspaso
!contacto
!horario
!todos
`,

"!nom059":
"NOM-059 regula buenas prácticas de fabricación de medicamentos.",

"!rechazo":
"Se detectó no conformidad durante inspección de producto.",

"!devolucion":
"Registrar lote, motivo y responsable.",

"!bitacora":
"La bitácora debe contener fecha, hora, usuario y acción.",

"!traspaso":
"Validar documento y existencia física.",

"!contacto":
"Responsable sanitario: ___",

"!horario":
"Horario L-V 8:00 a 17:00"
};



// ===== LISTENER =====

client.on('message', async msg => {

  if (!msg.from.endsWith('@g.us')) return;

  const now = Date.now();
  if (cooldown.has(msg.from)) {
    if (now - cooldown.get(msg.from) < COOLDOWN_MS) return;
  }
  cooldown.set(msg.from, now);

  const text = msg.body.toLowerCase().trim();

  await new Promise(r => setTimeout(r, humanDelay()));



  // ===== !TODOS SOLO ADMIN =====

  if (text === "!todos") {

    const chat = await msg.getChat();
    if (!chat.isGroup) return;

    const author = msg.author || msg.from;

    const isAdmin = chat.participants.find(p =>
      p.id._serialized === author && p.isAdmin
    );

    if (!isAdmin) {
      msg.reply("❌ Solo admins pueden usar !todos");
      return;
    }

    let mentions = [];
    let texto = "📢 Aviso para todos:\n";

    for (let p of chat.participants) {
      mentions.push(p.id._serialized);
      texto += `@${p.id.user} `;
    }

    await msg.reply(texto, null, { mentions });
    return;
  }



  // ===== COMANDOS NORMALES =====

  if (comandos[text]) {
    msg.reply(comandos[text]);
    return;
  }

});

client.initialize();



