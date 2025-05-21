import axios from 'axios';
import config from '../../config.cjs';

const repoCommand = async (m, Matrix) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    if (cmd !== 'repo') return;

    // Customizable newsletter JID
    const newsletterJID = config.NEWSLETTER_JID || '120363313938933929@newsletter';
    
    // Get sender info
    const senderName = m.pushName || "User";
    const senderJid = m.sender;

    try {
      // Fetch repository data from GitHub API
      const response = await axios.get('https://api.github.com/repos/carl24tech/Buddy-XTR', {
        headers: {
          'User-Agent': 'Buddy-XTR-Bot',
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      const repoData = response.data;
      
      // Format the repository information
      const repoInfo = `
📂 *${repoData.name}* 
🔗 ${repoData.html_url}
⭐ Stars: ${repoData.stargazers_count} 
🍴 Forks: ${repoData.forks_count}
📝 License: ${repoData.license?.name || 'None'}
📅 Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}
👨‍💻 Owner: ${repoData.owner.login}
      `.trim();

      // Send repository info with context
      await Matrix.sendMessage(m.from, {
        text: `${repoInfo}\n\nRequested by @${senderName.split(' ')[0]}`,
        mentions: [senderJid],
        contextInfo: {
          mentionedJid: [senderJid],
          forwardingScore: 999,
          isForwarded: true,
          participant: newsletterJID,
          stanzaId: m.id,
          quotedMessage: {
            conversation: "GitHub Repository Information"
          }
        }
      });

      // Additional tech info
      await Matrix.sendMessage(m.from, {
        text: `🛠️ *Technical Details*\n` +
              `Language: ${repoData.language || 'Not specified'}\n` +
              `Open Issues: ${repoData.open_issues_count}\n` +
              `Default Branch: ${repoData.default_branch}\n` +
              `Size: ${Math.round(repoData.size / 1024)} MB`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          participant: newsletterJID
        }
      });

    } catch (error) {
      console.error('Error fetching repo data:', error);
      
      // Fallback message
      await Matrix.sendMessage(m.from, {
        text: `⚠️ Failed to fetch repository data\n` +
              `Error: ${error.message}\n\n` +
              `Requested by @${senderName.split(' ')[0]}`,
        mentions: [senderJid],
        contextInfo: {
          mentionedJid: [senderJid],
          forwardingScore: 999,
          isForwarded: true,
          participant: newsletterJID
        }
      });
    }

  } catch (error) {
    console.error('Unexpected error in repo command:', error);
    await Matrix.sendMessage(m.from, {
      text: '⚠️ An unexpected error occurred while processing the repo command.'
    });
  }
};

export default repoCommand;
