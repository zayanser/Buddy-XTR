import config from '../../config.cjs';

// Store warning counts for users
const userWarnings = new Map();

// Main command function
const antitextcommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  // Handle the antitext command
  if (cmd === 'antitext') {
    if (!isCreator) return m.reply("*Only admin*");
    let responseMessage;

    if (text === 'on') {
      config.ANTI_TEXT = true;
      responseMessage = "Anti-Text has been enabled. Users will be warned 3 times before being blocked.";
    } else if (text === 'off') {
      config.ANTI_TEXT = false;
      responseMessage = "Anti-Text has been disabled.";
    } else {
      responseMessage = "Usage:\n- `antitext on`: Enable Anti-Text\n- `antitext off`: Disable Anti-Text";
    }

    try {
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
    } catch (error) {
      console.error("Error processing your request:", error);
      await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
    }
  }

  // Handle text detection and warning system
  if (config.ANTI_TEXT && !isCreator && m.message && m.message.conversation) {
    const userId = m.sender;
    const currentWarnings = userWarnings.get(userId) || 0;

    if (currentWarnings < 3) {
      // Increment warning count
      userWarnings.set(userId, currentWarnings + 1);
      
      const warningsLeft = 3 - currentWarnings;
      const warningMessage = `⚠️ Warning! You have been warned for texting (${currentWarnings + 1}/3). ${warningsLeft > 1 ? `${warningsLeft - 1} warnings left` : 'Last warning!'}`;
      
      try {
        await Matrix.sendMessage(m.from, { text: warningMessage }, { quoted: m });
      } catch (error) {
        console.error("Error sending warning:", error);
      }
    } else {
      // Block the user after 3 warnings
      try {
        await Matrix.updateBlockStatus(userId, 'block');
        userWarnings.delete(userId); // Remove from warning tracker
        await Matrix.sendMessage(m.from, { text: 'You have been blocked for excessive texting.' }, { quoted: m });
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    }
  }
};

export default antitextcommand;
