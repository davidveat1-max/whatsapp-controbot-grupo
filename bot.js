const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox','--disable-setuid-sandbox']
  }
});


// =======================
// ADMINS DEL BOT
// =======================
const BOT_ADMINS = [
  "522461742341"
];

function isBotAdmin(msg){
  const author = (msg.author || msg.from).replace('@c.us','');
  return BOT_ADMINS.includes(author);
}


// =======================
// DELAY ANTI SPAM
// =======================
let lastUse = {};
const DELAY = 3500;

function checkDelay(user){
  const now = Date.now();
  if(lastUse[user] && now - lastUse[user] < DELAY){
    return false;
  }
  lastUse[user] = now;
  return true;
}


// =======================
// BASE DE RESPUESTAS
// =======================
const RESPUESTAS = {

  "!horario": "🕒 AVENIDA INDUSTRIAL MILITAR NO. 1088, LOMAS DE SAN ISIDRO",
  "!ubicacion": "📍 Dirección: Calle ejemplo 123",
  "!contacto": "📞 Tel: 555-123-4567",
  "!correo": "✉ contacto@empresa.com",
  "!soporte": "🛠 Soporte técnico activo",
  "!pagos": "💳 Aceptamos transferencia",
  "!envios": "🚚 Envíos 24-48h",
  "!garantia": "🧾 Garantía 12 meses",
  "!requisitos": "📄 INE + comprobante",
  "!proceso": "⚙ Paso1 → Paso2 → Paso3",
  "!status": "📦 Usa !folio + número",
  "!cancelar": "❌ Solicita con soporte",
  "!actualizacion": "🔄 Sistema activo",
  "!version": "🤖 Bot v1.0",
  "!reglas": "📋 Respeto • No spam",
  "!grupo": "👥 Grupo informativo",
  "!ayuda2": "ℹ Usa !menu",
  "!faq": "❓ Preguntas frecuentes",
  "!docs": "📚 Documentación interna",
  "!extra": "⭐ Función extra"

};


// =======================
// QR
// =======================
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ BOT CONECTADO');
});


// =======================
// MENU
// =======================
function menu(){
return `
╔══════════════════╗
     🤖 MENU BOT
╚══════════════════╝

📌 GENERALES
!menu
!info
!reglas

📌 CONSULTAS
!horario
!ubicacion
!contacto
!correo
!pagos
!envios
!garantia
!requisitos
!proceso
!status

📌 SISTEMA
!version
!soporte
!faq
!docs

📌 ADMIN
!todos

`;
}


// =======================
// MENSAJES
// =======================
client.on('message', async msg => {

  const text = msg.body.toLowerCase();
  const user = (msg.author || msg.from);

  if(!checkDelay(user)) return;

  // MENU
  if(text === "!menu"){
    msg.reply(menu());
    return;
  }

  // INFO
  if(text === "!info"){
    msg.reply("🤖 Bot activo y funcionando");
    return;
  }

  // RESPUESTAS AUTOMATICAS
  if(RESPUESTAS[text]){
    msg.reply(RESPUESTAS[text]);
    return;
  }

  // ===================
  // MENCIONAR A TODOS
  // ===================
  if(text === "!todos"){

    if(!isBotAdmin(msg)){
      msg.reply("❌ No autorizado");
      return;
    }

    const chat = await msg.getChat();

    if(!chat.isGroup){
      msg.reply("⚠ Solo en grupos");
      return;
    }

    let mentions = [];
    let texto = "📢 Aviso general:\n";

    for (let p of chat.participants){
      mentions.push(p.id._serialized);
      texto += `@${p.id.user} `;
    }

    await msg.reply(texto, null, { mentions });
    return;
  }

});

client.initialize();


