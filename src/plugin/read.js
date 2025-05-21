import config from '../../config.cjs';

const autoreadCommand = async (m, Matrix) => {
  try {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const prefix = config.PREFIX || '!'; // Fallback prefix
    
    // Check if message starts with prefix
    if (!m.body.startsWith(prefix)) return;
    
    const cmd = m.body.slice(prefix.length).split(' ')[0].toLowerCase();
    const text = m.body.slice(prefix.length + cmd.length).trim();
    
    if (cmd !== 'autoread') return;

    // Validate creator
    const ownerJid = config.OWNER_NUMBER.includes('@') 
      ? config.OWNER_NUMBER 
      : config.OWNER_NUMBER + '@s.whatsapp.net';
    const isCreator = [botNumber, ownerJid].includes(m.sender);
    
    if (!isCreator) {
      return await Matrix.sendMessage(m.from, { text: "📛 THIS IS AN OWNER COMMAND" }, { quoted: m });
    }

    let responseMessage;
    
    if (text === 'on') {
      config.AUTO_READ = true;
      responseMessage = "✅ Auto-Read has been enabled.";
    } else if (text === 'off') {
      config.AUTO_READ = false;
      responseMessage = "❌ Auto-Read has been disabled.";
    } else {
      responseMessage = "Usage:\n- autoread on: Enable Auto-Read\n- autoread off: Disable Auto-Read";
    }

    await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    
  } catch (error) {
    console.error("Error in autoread command:", error);
    await Matrix.sendMessage(m.from, 
      { text: '🚨 An error occurred while processing your request.' }, 
      { quoted: m }
    );
  }
};

export default autoreadCommand;
