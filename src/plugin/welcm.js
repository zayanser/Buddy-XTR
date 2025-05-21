import config from '../../config.cjs';

const gcEvent = async (m, Matrix) => {
    const prefix = config.PREFIX;
    
    // Early return if message doesn't start with prefix
    if (!m.body.startsWith(prefix)) return;
    
    const cmd = m.body.slice(prefix.length).split(' ')[0].toLowerCase();
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'welcome') {
        try {
            // Validate group context
            if (!m.isGroup) {
                return await m.reply("*😎 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
            }

            // Get group metadata and participant info
            const groupMetadata = await Matrix.groupMetadata(m.from);
            const participants = groupMetadata.participants;
            const botNumber = await Matrix.decodeJid(Matrix.user.id);
            
            // Check admin privileges
            const botAdmin = participants.find(p => p.id === botNumber)?.admin;
            const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

            if (!botAdmin) {
                return await m.reply("*🕵️ BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
            }
            if (!senderAdmin) {
                return await m.reply("*😒 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");
            }

            // Handle welcome command options
            let responseMessage;
            switch (text.toLowerCase()) {
                case 'on':
                    config.WELCOME = true;
                    responseMessage = "✅ *WELCOME & LEFT messages have been enabled*";
                    break;
                case 'off':
                    config.WELCOME = false;
                    responseMessage = "❌ *WELCOME & LEFT messages have been disabled*";
                    break;
                default:
                    responseMessage = `*Usage:*\n\n• \`${prefix}welcome on\` - Enable welcome/left messages\n• \`${prefix}welcome off\` - Disable welcome/left messages`;
                    break;
            }

            await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });

        } catch (error) {
            console.error("Error in welcome command:", error);
            await Matrix.sendMessage(
                m.from, 
                { text: "⚠️ *An error occurred while processing your request*" }, 
                { quoted: m }
            );
        }
    }
};

export default gcEvent;
