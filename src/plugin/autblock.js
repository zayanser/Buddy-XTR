import config from '../../config.cjs';

const autoblockCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'autoblock') {
    if (!isCreator) return m.reply("*THIS IS AN OWNER COMMAND*");
    
    let responseMessage;

    if (text === 'on') {
      config.AUTO_BLOCK = true;
      responseMessage = `✓ Verified\n\n🔒 *AUTO-BLOCK ENABLED*\n_• The bot will now auto-block unknown users._\n\n📅 ${new Date().toLocaleDateString()}\n⏰ ${new Date().toLocaleTimeString()}`;
    } else if (text === 'off') {
      config.AUTO_BLOCK = false;
      responseMessage = `✓ Verified\n\n🔓 *AUTO-BLOCK DISABLED*\n_• The bot will no longer auto-block users._\n\n📅 ${new Date().toLocaleDateString()}\n⏰ ${new Date().toLocaleTimeString()}`;
    } else {
      responseMessage = `✓ Verified\n\n⚙️ *AUTO-BLOCK COMMAND*\n_• Usage:_\n\`${prefix}autoblock on\` - _Enable_\n\`${prefix}autoblock off\` - _Disable_\n\n📅 ${new Date().toLocaleDateString()}\n⏰ ${new Date().toLocaleTimeString()}`;
    }

    try {
      await Matrix.sendMessage(
        m.from,
        { 
          text: responseMessage,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            stanzaId: m.key.id,
            participant: m.sender,
            mentionedJid: [m.sender]
          }
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error sending status-style message:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Error processing your request.' }, { quoted: m });
    }
  }
};

export default autoblockCommand;
