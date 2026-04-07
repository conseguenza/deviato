// js/discord.js
// Fetches live Discord data from Lanyard API for user ID: 1445417551705149550

(function() {
    const DISCORD_USER_ID = '1445417551705149550';
    const WS_URL = 'wss://api.lanyard.rest/socket';
    
    let socket = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    
    // DOM elements
    const avatarImg = document.getElementById('avatarImg');
    const discordUsernameSpan = document.getElementById('discordUsername');
    const discordTagSpan = document.getElementById('discordTag');
    const statusIndicator = document.getElementById('statusIndicator');
    
    // Status mapping to icons and colors
    const statusConfig = {
        online: { icon: 'fas fa-circle', color: '#23a55a', name: 'Online' },
        idle: { icon: 'fas fa-circle', color: '#f0b232', name: 'Idle' },
        dnd: { icon: 'fas fa-circle', color: '#f13f43', name: 'Do Not Disturb' },
        offline: { icon: 'fas fa-circle', color: '#80848e', name: 'Offline' },
        streaming: { icon: 'fab fa-twitch', color: '#593695', name: 'Streaming' }
    };
    
    // Activity type mapping
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
        
        // Clear existing tooltip
        const existingTooltip = statusIndicator.querySelector('.status-tooltip');
        if (existingTooltip) existingTooltip.remove();
        
        let statusKey = status || 'offline';
        // Handle streaming specially
        if (activity && activity.type === 1) {
            statusKey = 'streaming';
        }
        
        const config = statusConfig[statusKey] || statusConfig.offline;
        
        // Update icon
        statusIndicator.innerHTML = `<i class="${config.icon}"></i>`;
        statusIndicator.className = `status-indicator ${statusKey}`;
        
        // Build tooltip text
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
        
        // Create tooltip
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
        
        // Find the most relevant activity (not custom status)
        let mainActivity = null;
        for (const act of activities) {
            if (act.type !== 4) { // 4 = custom status, skip for main activity display
                mainActivity = act;
                break;
            }
        }
        
        // Update username
        if (discordUser && discordUsernameSpan) {
            const displayName = discordUser.global_name || discordUser.username;
            discordUsernameSpan.textContent = displayName;
            // Also update the typewriter effect by resetting animation
            discordUsernameSpan.style.animation = 'none';
            discordUsernameSpan.offsetHeight; // force reflow
            discordUsernameSpan.style.animation = null;
        }
        
        // Update Discord tag (username#discriminator format or just username)
        if (discordUser && discordTagSpan) {
            if (discordUser.discriminator && discordUser.discriminator !== '0') {
                discordTagSpan.textContent = `${discordUser.username}#${discordUser.discriminator}`;
            } else {
                discordTagSpan.textContent = discordUser.username;
            }
        }
        
        // Update avatar
        if (discordUser && avatarImg) {
            const avatarHash = discordUser.avatar;
            if (avatarHash) {
                const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.gif?size=128`;
                const staticUrl = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.webp?size=128`;
                // Try GIF first for animated avatars
                const img = new Image();
                img.onload = () => {
                    avatarImg.src = avatarUrl;
                };
                img.onerror = () => {
                    avatarImg.src = staticUrl;
                };
                img.src = avatarUrl;
            } else {
                const defaultAvatar = `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`;
                avatarImg.src = defaultAvatar;
            }
        }
        
        // Update status with activity
        updateStatusDisplay(discordStatus, mainActivity);
    }
    
    function connectWebSocket() {
        try {
            socket = new WebSocket(WS_URL);
            
            socket.onopen = () => {
                console.log('[Discord] Lanyard WebSocket connected');
                reconnectAttempts = 0;
                // Subscribe to user
                socket.send(JSON.stringify({
                    op: 2,
                    d: {
                        subscribe_to_id: DISCORD_USER_ID
                    }
                }));
            };
            
            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.op === 1) {
                        // Heartbeat
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(JSON.stringify({ op: 1 }));
                        }
                    }
                    if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
                        if (data.d && data.d.users && data.d.users[DISCORD_USER_ID]) {
                            const userData = data.d.users[DISCORD_USER_ID];
                            const presenceData = {
                                discord_user: userData.discord_user,
                                discord_status: userData.discord_status,
                                activities: userData.activities || [],
                                kv: userData.kv || {}
                            };
                            updateDiscordData(presenceData);
                        } else if (data.d && data.d.discord_user) {
                            // Direct presence update format
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
        setTimeout(() => {
            connectWebSocket();
        }, delay);
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
    
    // Initialize
    function init() {
        // First try REST API for immediate data
        fetchFallbackData();
        // Then establish WebSocket for live updates
        connectWebSocket();
    }
    
    // Start after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();