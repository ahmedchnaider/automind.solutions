/*!
* Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/automind.solutions' : '';

function getAssetPath(filename) {
    return `${basePath}/assets/img/${filename}`;
}

const videoSources = {
    create: getAssetPath('create.mp4'),
    mointer: getAssetPath('mointer.mp4')
};

const imageUrls = {
    dropshippers: getAssetPath('dropshippers.png'),
    influencerchat: getAssetPath('influencerchat.PNG'),
    influencer: getAssetPath('influencer.png')
};

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        businessModels: document.querySelectorAll('.business-model'),
        chatWidgetTitle: document.getElementById('chatWidgetTitle'),
        chatMessages: document.getElementById('chatMessages'),
        userInput: document.getElementById('userInput'),
        sendMessage: document.getElementById('sendMessage'),
        logo: document.getElementById('logo'),
        mainNav: document.body.querySelector('#mainNav')
    };

    // API Configuration
    const API_CONFIG = {
        url: 'https://eu-vg-edge.moeaymandev.workers.dev/agents/i8b98uq6pli7bkn0/interact/11',
        headers: {
            'Authorization': 'Bearer vg_TxeKdi16uYGkYiOtn2Jf',
            'Content-Type': 'application/json'
        }
    };

    // Add this variable to track current business model
    let currentBusinessModel = 'influencer';

    // Add click handlers for business models
    elements.businessModels.forEach(model => {
        model.addEventListener('click', function() {
            const modelType = this.querySelector('.business-model-text').dataset.model;
            currentBusinessModel = modelType;
        });
    });

    // Chat Functions
    function sendMessage(message) {
        // Include the business model context if one is selected
        const contextPrefix = currentBusinessModel 
            ? `[Context: User is on website, viewing ${currentBusinessModel} business solution] ` 
            : '[Context: User is on website] ';
        
        const enhancedMessage = contextPrefix + message;

        fetch(API_CONFIG.url, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify({
                action: {
                    type: 'text',
                    payload: enhancedMessage
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            // Get all bot turns
            const botTurns = data.turns.filter(turn => turn.from === "bot");
            // Get the last bot turn
            const lastBotTurn = botTurns[botTurns.length - 1];
            // Get the message from the last turn
            let botMessage = lastBotTurn?.messages[0]?.item?.payload?.message;
            
            // Convert URLs to clickable links
            if (botMessage) {
                // Regular expression to find URLs
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                botMessage = botMessage.replace(urlRegex, url => `<a href="${url}" target="_blank" class="text-primary">${url}</a>`);
                
                addBotMessage(botMessage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addBotMessage("Sorry, there was an error processing your message.");
        });
    }

    function addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'mb-3 d-flex align-items-start flex-column';
        
        // Create the message bubble with logo, allowing HTML content
        const bubbleContent = `
            <div class="d-flex align-items-end">
                <img src="assets/img/logo.png" alt="AI Agent" class="rounded-circle me-2" style="width: 28px; height: 28px;">
                <div class="message-bubble bot-message">${message}</div>
            </div>`;

        // Add buttons if it's a business model message
        let buttonsHtml = '';
        if (message.includes('carousel-container')) {
            const modelType = currentBusinessModel || 'influencer';
            const buttonConfig = {
                'dropshipper': [
                    { text: 'Buy Now', action: 'Buy', primary: true },
                    { text: 'Learn More', action: 'Learn', primary: false }
                ],
                'themepages': [
                    { text: 'Follow', action: 'Design', primary: true },
                    { text: 'Convert', action: 'Convert', primary: false }
                ],
                'influencer': [
                    { text: 'Call', action: 'Grow', primary: true },
                    { text: 'Monetize', action: 'Monetize', primary: false }
                ],
                'community': [
                    { text: 'Join', action: 'Build', primary: true },
                    { text: 'Engage', action: 'Engage', primary: false }
                ],
                'tiktok': [
                    { text: 'Go Viral', action: 'Viral', primary: true },
                    { text: 'Grow', action: 'Grow', primary: false }
                ]
            };

            const buttons = buttonConfig[modelType];
            buttonsHtml = `
                <div class="mt-2 ms-5 d-flex gap-2">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.primary ? 'btn-primary' : 'btn-outline-primary'} btn-sm" 
                                onclick="sendCustomMessage('${modelType}', '${btn.action}')">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>`;
        }

        messageElement.innerHTML = bubbleContent + buttonsHtml;
        elements.chatMessages.appendChild(messageElement);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    // Add this function outside the DOMContentLoaded event listener
    window.sendCustomMessage = function(type, action) {
        let message;
        switch(type) {
            case 'themepages':
                message = action === 'Follow' ? "i want to get the travel guide eBook, send me the link to buy" : "give me the link to buy the ebook";
                break;
            case 'influencer':
                message = action === 'Call' ? "I want to get a phone call from you Lilly" : "let's talk throw phone call";
                break;
            case 'community':
                message = action === 'Join' ? "Send me the link to join your community" : "how can Join automind community";
                break;
            case 'tiktok':
                message = action === 'Viral' ? "How do I create viral content?" : "Help me grow my TikTok";
                break;
            case 'dropshipper':
                message = action === 'Buy' ? "I want to buy send me the link to the Interactive Laser & Feather Cat Toy!" : "Tell me more about Feather Cat Toy";
                break;
        }

        // Add user message to chat
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const userMessage = document.createElement('div');
            userMessage.className = 'mb-3 d-flex justify-content-end';
            userMessage.innerHTML = `<div class="message-bubble user-message">${message}</div>`;
            chatMessages.appendChild(userMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Include context prefix in API call
            const contextPrefix = currentBusinessModel 
                ? `[Context: User is on website, viewing ${currentBusinessModel} business solution] `
                : '[Context: User is on website] ';
            
            const enhancedMessage = contextPrefix + message;

            // Make API call with context
            fetch(API_CONFIG.url, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({
                    action: {
                        type: 'text',
                        payload: enhancedMessage
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                const botTurns = data.turns.filter(turn => turn.from === "bot");
                const lastBotTurn = botTurns[botTurns.length - 1];
                const botMessage = lastBotTurn?.messages[0]?.item?.payload?.message;
                if (botMessage) addBotMessage(botMessage);
            })
            .catch(error => {
                console.error('Error:', error);
                addBotMessage("Sorry, there was an error processing your message.");
            });
        }
    };

    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'mb-3 d-flex justify-content-end';
        messageElement.innerHTML = `
            <div class="message-bubble user-message">${message}</div>
        `;
        elements.chatMessages.appendChild(messageElement);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    function handleUserInput() {
        const message = elements.userInput.value.trim();
        if (message) {
            addUserMessage(message);
            elements.userInput.value = '';
            
            // Include context prefix
            const contextPrefix = currentBusinessModel 
                ? `[Context: User is on website, viewing ${currentBusinessModel} business solution] `
                : '[Context: User is on website] ';
            
            const enhancedMessage = contextPrefix + message;
            
            // Make API call with context
            fetch(API_CONFIG.url, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({
                    action: {
                        type: 'text',
                        payload: enhancedMessage
                    }
                })
            })
            .then(response => response.json())
            .then(data => {
                const botTurns = data.turns.filter(turn => turn.from === "bot");
                const lastBotTurn = botTurns[botTurns.length - 1];
                const botMessage = lastBotTurn?.messages[0]?.item?.payload?.message;
                if (botMessage) addBotMessage(botMessage);
            })
            .catch(error => {
                console.error('Error:', error);
                addBotMessage("Sorry, there was an error processing your message.");
            });
        }
    }

    function selectBusinessModel(model) {
        // Update model styling
        elements.businessModels.forEach(m => {
            const icon = m.querySelector('.business-model-icon');
            if (m === model) {
                m.classList.add('selected');
                icon.style.color = '#2937f0';
            } else {
                m.classList.remove('selected');
                icon.style.color = '';
            }
        });

        // Get the model type
        const modelType = model.querySelector('.business-model-icon').getAttribute('data-model');
        
        // Update both chat widget title and primary agent
        const chatWidgetTitle = document.getElementById('chatWidgetTitle');
        const primaryAgentName = document.getElementById('primaryAgentName');
        const primaryAgentImage = document.getElementById('primaryAgentImage');
        let profileImage = 'logo.png'; // default image
        let agentName = 'AI Assistant'; // default name

        switch(modelType) {
            case 'themepages':
                agentName = 'Travel & Adventure';
                profileImage = 'travel.jpg';
                break;
            case 'influencer':
                agentName = 'Lilly';
                profileImage = 'influ.jpg';
                break;
            case 'dropshipper':
                agentName = 'CatToy';
                profileImage = 'store.jpg';
                break;
            case 'community':
                agentName = 'Community AI';
                break;
            case 'tiktok':
                agentName = 'TikTok AI';
                break;
            default:
                agentName = 'AI Assistant';
        }

        // Update both header and primary agent
        chatWidgetTitle.textContent = agentName;
        primaryAgentName.textContent = agentName;
        
        // Update both profile images
        const headerProfileImage = document.querySelector('.card-header .rounded-circle');
        if (headerProfileImage) {
            headerProfileImage.src = `assets/img/${profileImage}`;
        }
        if (primaryAgentImage) {
            primaryAgentImage.src = `assets/img/${profileImage}`;
        }

        // Clear chat messages
        elements.chatMessages.innerHTML = '';
        
        // Add initial message based on business model
        let initialMessage;
        switch(modelType) {
            case 'themepages':
                initialMessage = `
                    <div class="message-content">
                        <p>Hey!! Welcome to our theme page, Travel & Adventure Photography, we have a 20% off sale on our digital travel guide eBook now!!</p>
                        <div class="carousel-container mt-3 mb-3">
                            <div class="message-carousel">
                                <img src="assets/img/themehat.jpg" alt="Theme Pages Solutions" class="carousel-image">
                               
                            </div>
                        </div>
                      
                    </div>`;
                break;
            case 'influencer':
                initialMessage = `
                    <div class="message-content">
                        <p>Hi there! I'm Lily Summers AI, your Lifestyle Influencer. do you want to get a phone call from me?</p>
                        <div class="carousel-container mt-3 mb-3">
                            <div class="message-carousel">
                                <img src="assets/img/influencerchat.png" alt="Influencer Marketing" class="carousel-image">
                                
                            </div>
                        </div>
                        
                    </div>`;
                break;
            case 'community':
                initialMessage = `
                    <div class="message-content">
                        <p>Welcome to Automind's Community! I'm here to teach you how to build a community, engage, and grow your online community.</p>
                        <div class="carousel-container mt-3 mb-3">
                            <div class="message-carousel">
                                <img src="assets/img/communitychat.jpg" alt="Community Management" class="carousel-image">
                               
                                </div>
                            </div>
                        </div>
                       
                    </div>`;
                break;
            case 'tiktok':
                initialMessage = `
                    <div class="message-content">
                        <p>Hey! Tiktok AI is Not available yet, but we will let you know when it's ready</p>
                        <div class="carousel-container mt-3 mb-3">
                            <div class="message-carousel">
                                <img src="assets/img/tiktok.jpg" alt="TikTok Growth" class="carousel-image">
                               
                                </div>
                            </div>
                        </div>
                    </div>`;
                break;
            default: // dropshippers
                initialMessage = `
                    <div class="message-content">
                        <p>Hey there! 👋 Welcome to our store! Check out our hot seller—the Interactive Laser & Feather Cat Toy! 🐾Let me know if you’d like to get a PROMO CODE throw a phone call from me!</p>
                        <div class="carousel-container mt-3 mb-3">
                            <div class="message-carousel">
                                <img src="assets/img/product.jpg" alt="Dropshipping Solutions" class="carousel-image">
                               
                                </div>
                            </div>
                        </div>
                    
                    </div>`;
        }
        
        // Add the initial message
        addBotMessage(initialMessage);

        // Get chat demo element
        const chatDemo = document.getElementById('chat-demo');
        
        // Add fade out effect
        chatDemo.classList.add('fade-out');
        
        // Change background after fade out
        setTimeout(() => {
            // Update background image based on model type
            let newImage;
            switch(modelType) {
                case 'themepages':
                    newImage = 'themepages.jpg';
                    break;
                case 'influencer':
                    newImage = 'influencer.jpg';
                    break;
                case 'community':
                    newImage = 'community.jpg';
                    break;
                case 'tiktok':
                    newImage = 'tiktok.png';
                    break;
                default:
                    newImage = 'dropshippers.jpg';
            }
            chatDemo.style.background = `url('assets/img/${newImage}') no-repeat center center`;
            chatDemo.style.backgroundSize = 'cover';
            
            // Remove fade out class to fade back in
            chatDemo.classList.remove('fade-out');
        }, 300);
    }

    // Event Listeners
    elements.sendMessage.addEventListener('click', handleUserInput);
    elements.userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleUserInput();
    });

    elements.businessModels.forEach(model => {
        model.addEventListener('click', () => selectBusinessModel(model));
    });

    // Logo hover effect
    const logo = document.getElementById('navbar-logo');
    if (logo) {
        const originalSrc = 'assets/img/logo.png';
        const hoverSrc = 'assets/img/logo2.png';
        
        logo.addEventListener('mouseenter', function() {
            this.src = hoverSrc;
        });
        
        logo.addEventListener('mouseleave', function() {
            this.src = originalSrc;
        });
    }

    // Initialize
    const defaultModel = document.querySelector('.business-model-icon[data-model="influencer"]')?.closest('.business-model');
    if (defaultModel) selectBusinessModel(defaultModel);

    // Bootstrap ScrollSpy
    if (elements.mainNav) {
        const spy = new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
            threshold: [0.4, 0.6],
            offset: 100
        });

        // Refresh ScrollSpy after dynamic content loads
        setTimeout(() => {
            spy.refresh();
        }, 1000);
    }




    // WhatsApp QR Widget Functions
    window.showQRWidget = function() {
        const widget = document.getElementById('whatsappQRWidget');
        if (widget) {
            widget.style.display = 'block';
            widget.style.opacity = '0';
            setTimeout(() => {
                widget.style.opacity = '1';
                widget.style.transition = 'opacity 0.3s ease';
            }, 10);
        }
    };

    window.closeQRWidget = function() {
        const widget = document.getElementById('whatsappQRWidget');
        if (widget) {
            widget.style.opacity = '0';
            widget.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                widget.style.display = 'none';
            }, 300);
        }
    };

    // Close widget when clicking outside
    document.addEventListener('click', function(event) {
        const widget = document.getElementById('whatsappQRWidget');
        const whatsappBubble = document.querySelector('.bubble-whatsapp');
        
        if (widget && widget.style.display === 'block' && 
            !widget.contains(event.target) && 
            !whatsappBubble.contains(event.target)) {
            window.closeQRWidget();
        }
    });

    // Prevent closing when clicking inside the widget
    document.getElementById('whatsappQRWidget').addEventListener('click', function(event) {
        event.stopPropagation();
    });



    // Video Player functionality
    const video = document.getElementById('heroVideo');
    const mainPlayButton = document.createElement('div');
    mainPlayButton.className = 'play-button-overlay';
    mainPlayButton.innerHTML = '<i class="fas fa-play"></i>';

    // Add play/pause button to video container
    if (video) {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        video.parentNode.insertBefore(videoContainer, video);
        videoContainer.appendChild(video);
        videoContainer.appendChild(mainPlayButton);

        // Toggle play/pause on video click
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                mainPlayButton.classList.add('hidden');
            } else {
                video.pause();
                mainPlayButton.classList.remove('hidden');
            }
        });

        // Handle play button click
        mainPlayButton.addEventListener('click', function() {
            video.play()
                .then(() => {
                    video.muted = false;
                    mainPlayButton.classList.add('hidden');
                })
                .catch(error => {
                    console.log("Video playback failed:", error);
                });
        });

        // Show play button when video is paused
        video.addEventListener('pause', function() {
            mainPlayButton.classList.remove('hidden');
        });

        // Hide play button when video is playing
        video.addEventListener('play', function() {
            mainPlayButton.classList.add('hidden');
        });
    }

    // Video detachment functionality
    const initVideoDetachment = () => {
        const heroSection = document.querySelector('.masthead');
        const floatingContainer = document.getElementById('floating-video-container');
        const closeButton = document.getElementById('close-floating-video');
        const mainVideo = document.getElementById('heroVideo');
        const floatingVideo = document.getElementById('floating-video');
        
        if (!heroSection || !floatingContainer || !closeButton || !mainVideo || !floatingVideo) {
            console.warn('One or more video elements not found');
            return;
        }

        let isDetached = false;
        let isStopped = false;

        // Add click handler for floating video
        floatingVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });

        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (rect.top <= 0 && rect.bottom >= 0);
        }

        // Handle scroll event
        const scrollHandler = () => {
            if (isStopped) return;

            if (!isDetached && !isInViewport(heroSection)) {
                floatingContainer.classList.add('visible');
                floatingVideo.currentTime = mainVideo.currentTime;
                if (!mainVideo.paused) {
                    floatingVideo.play(); // Only play if main video was playing
                }
                isDetached = true;
            } else if (isDetached && isInViewport(heroSection)) {
                floatingContainer.classList.remove('visible');
                mainVideo.currentTime = floatingVideo.currentTime;
                if (!floatingVideo.paused) {
                    mainVideo.play(); // Only play if floating video was playing
                }
                isDetached = false;
            }
        };

        // Handle close button
        closeButton.addEventListener('click', () => {
            floatingContainer.classList.remove('visible');
            isDetached = false;
            isStopped = true;
            floatingVideo.pause();
        });

        // Add scroll event listener
        window.addEventListener('scroll', scrollHandler);

        // Copy video source from main video
        floatingVideo.src = mainVideo.querySelector('source').src;
    };

    // Initialize video detachment after DOM content is loaded
    initVideoDetachment();

    // Video playback functionality
    const heroVideo = document.getElementById('heroVideo');
    const playButton = document.querySelector('.video-play-button');

    if (heroVideo && playButton) {
        playButton.addEventListener('click', function() {
            heroVideo.play()
                .then(() => {
                    heroVideo.muted = false;  // Unmute after play starts
                    playButton.classList.add('hidden');
                })
                .catch(error => {
                    console.log("Video playback failed:", error);
                });
        });

        // Show play button again when video ends
        heroVideo.addEventListener('ended', function() {
            playButton.classList.remove('hidden');
            heroVideo.currentTime = 0;  // Reset video to start
        });

        // Pause video if user navigates away from tab
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                heroVideo.pause();
                playButton.classList.remove('hidden');
            }
        });
    }

    // Add these chat starter functions
    function startThemeChat() {
        addUserMessage("I want to optimize my theme for better conversions");
        sendMessage("I want to optimize my theme for better conversions");
    }

    function startInfluencerChat() {
        addUserMessage("Help me grow my social media presence");
        sendMessage("Help me grow my social media presence");
    }

    function startCommunityChat() {
        addUserMessage("I need help building an engaged community");
        sendMessage("I need help building an engaged community");
    }

    function startTikTokChat() {
        addUserMessage("How can I create viral TikTok content?");
        sendMessage("How can I create viral TikTok content?");
    }

    function startDropshippingChat() {
        addUserMessage("I want to scale my dropshipping store");
        sendMessage("I want to scale my dropshipping store");
    }

    // Update the toggle function
    function toggleChatWidget() {
        // Try to find the chat container
        let chatContainer = document.querySelector('.vg-container');
        
        // If container doesn't exist, create and initialize it
        if (!chatContainer) {
            // Initialize TIXAE widget if not already done
            if (!window.VG_SCRIPT_LOADED) {
                window.VG_CONFIG = {
                    ID: "nhxcjza5hhmlkwli",
                    region: 'eu',
                    render: 'bottom-right',
                    stylesheets: [
                        "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css"
                    ]
                };
                
                const script = document.createElement("script");
                script.src = "https://vg-bunny-cdn.b-cdn.net/vg_live_build/vg_bundle.js";
                script.onload = function() {
                    window.VG_SCRIPT_LOADED = true;
                    // Try again after script loads
                    setTimeout(toggleChatWidget, 100);
                };
                document.body.appendChild(script);
                return;
            }
            return;
        }

        // Toggle the chat container visibility
        if (window.getComputedStyle(chatContainer).display === 'none') {
            chatContainer.style.display = 'block';
            chatContainer.style.position = 'fixed';
            chatContainer.style.right = '80px';
            chatContainer.style.bottom = '20px';
            chatContainer.style.width = '400px';
            chatContainer.style.height = '600px';
            chatContainer.style.zIndex = '1000';
        } else {
            chatContainer.style.display = 'none';
        }
    }

    // Remove the self-executing function since we're handling initialization in toggleChatWidget
    window.VG_CONFIG = {
        ID: "nhxcjza5hhmlkwli",
        region: 'eu',
        render: 'bottom-right',
        stylesheets: [
            "https://vg-bunny-cdn.b-cdn.net/vg_live_build/styles.css"
        ]
    };

});

