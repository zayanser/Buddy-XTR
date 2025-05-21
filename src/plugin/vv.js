import config from '../../config.cjs';
import fs from 'fs';
import { tmpdir } from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const vvCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === 'vv') {
    if (!m.quoted) {
      await Matrix.sendMessage(m.from, { edit: m.key, text: " " }); // Erase invalid cmd
      return m.reply("❌ Reply to a *view once* media message.").then(msg => {
        setTimeout(() => Matrix.sendMessage(m.from, { edit: msg.key, text: " " }), 3000); // Auto-erase error
      });
    }

    try {
      const quotedMsg = m.quoted;
      if (!quotedMsg?.message?.viewOnceMessage) {
        await Matrix.sendMessage(m.from, { edit: m.key, text: " " }); // Erase invalid cmd
        return m.reply("⚠️ This is not a *view once* message.").then(msg => {
          setTimeout(() => Matrix.sendMessage(m.from, { edit: msg.key, text: " " }), 3000);
        });
      }

      // Extract view-once media
      const mediaType = Object.keys(quotedMsg.message.viewOnceMessage.message)[0]; // 'imageMessage' or 'videoMessage'
      const media = quotedMsg.message.viewOnceMessage.message[mediaType];
      const mediaBuffer = await Matrix.downloadMediaMessage(quotedMsg);

      // Save to temp file
      const tmpPath = `${tmpdir()}/${media.fileSha256.toString('hex')}.${mediaType === 'imageMessage' ? 'jpg' : 'mp4'}`;
      fs.writeFileSync(tmpPath, mediaBuffer);

      // Forward to user's DM with caption
      const caption = `🔐 *Saved View-Once Media*\n⚡ *Powered by Carltech*`;
      await Matrix.sendMessage(
        m.sender,
        {
          [mediaType === 'imageMessage' ? 'image' : 'video']: fs.readFileSync(tmpPath),
          caption: caption,
          mimetype: media.mimetype
        }
      );

      // Clean up temp file
      fs.unlinkSync(tmpPath);

      // Stealth edit: Erase "!vv" command
      await Matrix.sendMessage(m.from, { edit: m.key, text: " " });

    } catch (error) {
      console.error("Error saving view-once media:", error);
      await Matrix.sendMessage(m.sender, { text: "⚠️ Failed to save. Media may have expired." });
      await Matrix.sendMessage(m.from, { edit: m.key, text: " " }); // Erase cmd even on error
    }
  }
};

export default vvCommand;
