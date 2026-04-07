// js/discord.js
(function() {
    const DISCORD_USER_ID = '1445417551705149550';
    const DISCORD_PROFILE_URL = `https://discord.com/users/${DISCORD_USER_ID}`;
    const TIKTOK_URL = 'https://tiktok.com/@indicate';
    const WS_URL = 'wss://api.lanyard.rest/socket';
    
    let socket = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    
    // DOM elements
    const avatarImg = document.getElementById('avatarImg');
    const discordUsernameSpan = document.getElementById('discordUsername');
    const discordTagSpan = document.getElementById('discordTag');
    const statusIndicator = document.getElementById('statusIndicator');
    const discordUsernameLink = document.getElementById('discordUsernameLink');
    const discordContactLink = document.getElementById('discordContactLink');
    const tiktokContactLink = document.getElementById('tiktokContactLink');
    
    // Set up Discord profile links
    if (discordUsernameLink) {
        discordUsernameLink.href = DISCORD_PROFILE_URL;
    }
    if (discordContactLink) {
        discordContactLink.href = DISCORD_PROFILE_URL;
    }
    
    // Set up TikTok link
    if (tiktokContactLink) {
        tiktokContactLink.href = TIKTOK_URL;
    }
    
    // Status mapping
    const statusConfig = {
        online: { icon: 'fas fa-circle', color: '#23a55a', name: 'Online' },
        idle: { icon: 'fas fa-circle', color: '#f0b232', name: 'Idle' },
        dnd: { icon: 'fas fa-circle', color: '#f13f43', name: 'Do Not Disturb' },
        offline: { icon: 'fas fa-circle', color: '#80848e', name: 'Offline' },
        streaming: { icon: 'fab fa-twitch', color: '#593695', name: 'Streaming' }
    };
    
    const activityNames = {
        0: 'Playing',
        1: 'Streaming',
        2: 'Listening to',
        3: 'Watching',
        4: 'Custom',
        5: 'Competing in'
    };
    
    function updateStatusDisplay(status, activity = null) {
        if (!statusIndicator) return;
        
        const existingTooltip = statusIndicator.querySelector('.status-tooltip');
        if (existingTooltip) existingTooltip.remove();
        
        let statusKey = status || 'offline';
        if (activity && activity.type === 1) {
            statusKey = 'streaming';
        }
        
        const config = statusConfig[statusKey] || statusConfig.offline;
        
        statusIndicator.innerHTML = `<i class="${config.icon}"></i>`;
        statusIndicator.className = `status-indicator ${statusKey}`;
        
        let tooltipText = `${config.name}`;
        if (activity) {
            const action = activityNames[activity.type] || 'Playing';
            let details = '';
            if (activity.name) {
                if (activity.type === 2) {
                    details = `${action} ${activity.name}`;
                    if (activity.details) details += ` — ${activity.details}`;
                } else {
                    details = `${action} ${activity.name}`;
                    if (activity.details) details += ` · ${activity.details}`;
                }
            }
            if (details) tooltipText += ` · ${details}`;
        }
        
        const tooltip = document.createElement('span');
        tooltip.className = 'status-tooltip';
        tooltip.textContent = tooltipText;
        statusIndicator.appendChild(tooltip);
    }
    
    function updateDiscordData(data) {
        if (!data) return;
        
        const discordUser = data.discord_user;
        const discordStatus = data.discord_status;
        const activities = data.activities || [];
        
        let mainActivity = null;
        for (const act of activities) {
            if (act.type !== 4) {
                mainActivity = act;
                break;
            }
        }
        
        if (discordUser && discordUsernameSpan) {
            const displayName = discordUser.global_name || discordUser.username;
            discordUsernameSpan.textContent = displayName;
            discordUsernameSpan.style.animation = 'none';
            discordUsernameSpan.offsetHeight;
            discordUsernameSpan.style.animation = null;
        }
        
        if (discordUser && discordTagSpan) {
            if (discordUser.discriminator && discordUser.discriminator !== '0') {
                discordTagSpan.textContent = `${discordUser.username}#${discordUser.discriminator}`;
            } else {
                discordTagSpan.textContent = discordUser.username;
            }
        }
        
        if (discordUser && avatarImg) {
            const avatarHash = discordUser.avatar;
            if (avatarHash) {
                const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.gif?size=128`;
                const staticUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.webp?size=128`;
                const img = new Image();
                img.onload = () => { avatarImg.src = avatarUrl; };
                img.onerror = () => { avatarImg.src = staticUrl; };
                img.src = avatarUrl;
            } else {
                const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`;
                avatarImg.src = defaultAvatar;
            }
        }
        
        updateStatusDisplay(discordStatus, mainActivity);
    }
    
    function connectWebSocket() {
        try {
            socket = new WebSocket(WS_URL);
            
            socket.onopen = () => {
                console.log('[Discord] Lanyard WebSocket connected');
                reconnectAttempts = 0;
                socket.send(JSON.stringify({
                    op: 2,
                    d: { subscribe_to_id: DISCORD_USER_ID }
                }));
            };
            
            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.op === 1) {
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ op: 1 }));
                        }
                    }
                    if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
                        if (data.d && data.d.users && data.d.users[DISCORD_USER_ID]) {
                            const userData = data.d.users[DISCORD_USER_ID];
                            updateDiscordData(userData);
                        } else if (data.d && data.d.discord_user) {
                            updateDiscordData(data.d);
                        }
                    }
                } catch (err) {
                    console.warn('[Discord] Error parsing message:', err);
                }
            };
            
            socket.onerror = (error) => {
                console.warn('[Discord] WebSocket error:', error);
            };
            
            socket.onclose = () => {
                console.log('[Discord] WebSocket closed, reconnecting...');
                attemptReconnect();
            };
        } catch (err) {
            console.warn('[Discord] Connection failed:', err);
            attemptReconnect();
        }
    }
    
    function attemptReconnect() {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.warn('[Discord] Max reconnect attempts reached, using fallback');
            fetchFallbackData();
            return;
        }
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(() => connectWebSocket(), delay);
    }
    
    async function fetchFallbackData() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            if (response.ok) {
                const json = await response.json();
                if (json.success && json.data) {
                    updateDiscordData(json.data);
                }
            }
        } catch (err) {
            console.warn('[Discord] Fallback fetch failed:', err);
        }
    }
    
    function init() {
        fetchFallbackData();
        connectWebSocket();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();