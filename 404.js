// 404.js - Script para Página de Erro 404 da Classic Fedora
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================
    // 1. INICIALIZAÇÃO E CONFIGURAÇÃO
    // ============================
    
    console.log('🔧 Classic Fedora 404 Script Carregado');
    
    // Configurações
    const config = {
        analyticsEnabled: true,           // Ativar rastreamento de erros
        searchEnabled: true,              // Ativar busca inteligente
        localStorageEnabled: true,        // Ativar localStorage para histórico
        animationSpeed: 300,              // Velocidade das animações (ms)
        maxSearchHistory: 10,             // Máximo de buscas salvas
    };
    
    // ============================
    // 2. ELEMENTOS DO DOM
    // ============================
    
    const elements = {
        currentUrl: document.getElementById('currentUrl'),
        searchForm: document.getElementById('searchForm'),
        searchInput: document.getElementById('searchInput'),
        searchButton: document.querySelector('.search-button'),
        suggestions: document.querySelectorAll('.suggestion-card'),
        actionButtons: document.querySelectorAll('.action-btn'),
        errorIcon: document.querySelector('.error-icon'),
        errorCode: document.querySelector('.error-code'),
    };
    
    // ============================
    // 3. DADOS DO SITE
    // ============================
    
    const sitePages = [
        {
            title: 'Página Principal',
            url: 'index.html',
            icon: 'fas fa-home',
            keywords: ['inicio', 'principal', 'home', 'começo', 'classic fedora', 'fedora', 'crew'],
            description: 'Volte para a página principal da Classic Fedora'
        },
        {
            title: 'Enciclopédia/Artigo',
            url: 'artigo.html',
            icon: 'fas fa-book-open',
            keywords: ['artigo', 'enciclopedia', 'wiki', 'informação', 'história', 'filosofia', 'aprender'],
            description: 'Leia nosso artigo completo sobre a Classic Fedora'
        },
        {
            title: 'Biblioteca de Artigos',
            url: 'biblioteca.html',
            icon: 'fas fa-book',
            keywords: ['biblioteca', 'artigos', 'tutoriais', 'guias', 'tutorial', 'aprendizado', 'pvp'],
            description: 'Acesse todos os tutoriais e guias da crew'
        },
        {
            title: 'Central de Suporte',
            url: 'suporte.html',
            icon: 'fas fa-life-ring',
            keywords: ['suporte', 'ajuda', 'faq', 'problema', 'dúvida', 'contato', 'socorro'],
            description: 'Encontre ajuda e respostas para suas dúvidas'
        },
        {
            title: 'Navegação do Site',
            url: 'navegacao.html',
            icon: 'fas fa-sitemap',
            keywords: ['navegação', 'mapa', 'páginas', 'explorar', 'menu', 'índice', 'todas páginas'],
            description: 'Veja todas as páginas disponíveis em um só lugar'
        },
        {
            title: 'Como Entrar na Crew',
            url: 'entrar.html',
            icon: 'fas fa-door-open',
            keywords: ['entrar', 'membro', 'participar', 'ingressar', 'aplicação', 'recrutamento'],
            description: 'Processo completo para se tornar um membro'
        },
        {
            title: 'Eventos e Torneios',
            url: 'eventos.html',
            icon: 'fas fa-calendar-alt',
            keywords: ['evento', 'torneio', 'competição', 'workshop', 'atividade', 'agenda'],
            description: 'Calendário de eventos e competições da crew'
        }
    ];
    
    // ============================
    // 4. FUNÇÕES PRINCIPAIS
    // ============================
    
    /**
     * Exibe a URL que causou o erro 404
     */
    function displayCurrentUrl() {
        if (elements.currentUrl) {
            const url = window.location.href;
            elements.currentUrl.textContent = url;
            elements.currentUrl.title = url;
            
            // Destaca partes problemáticas da URL
            highlightProblematicUrl(url);
        }
    }
    
    /**
     * Destaca partes problemáticas da URL
     */
    function highlightProblematicUrl(url) {
        const commonErrors = [
            { pattern: /\.php$/i, fix: '.html' },
            { pattern: /\.aspx$/i, fix: '.html' },
            { pattern: /\.jsp$/i, fix: '.html' },
            { pattern: /index\.[a-z]+$/i, fix: 'index.html' },
            { pattern: /home\.[a-z]+$/i, fix: 'index.html' },
            { pattern: /\/\/\//, fix: '//' },
            { pattern: /www\./, fix: '' }
        ];
        
        let highlightedUrl = url;
        let foundErrors = [];
        
        commonErrors.forEach(error => {
            if (error.pattern.test(url)) {
                const corrected = url.replace(error.pattern, error.fix);
                foundErrors.push({
                    original: url.match(error.pattern)[0],
                    correction: error.fix,
                    fullCorrection: corrected
                });
            }
        });
        
        // Se encontrou erros, mostra sugestão
        if (foundErrors.length > 0 && config.localStorageEnabled) {
            showUrlCorrection(foundErrors[0]);
        }
    }
    
    /**
     * Mostra sugestão de correção de URL
     */
    function showUrlCorrection(error) {
        const correctionHtml = `
            <div class="url-correction" style="
                background: rgba(255, 215, 0, 0.1);
                border-left: 3px solid gold;
                padding: 10px;
                margin-top: 10px;
                border-radius: 0 8px 8px 0;
                animation: fadeIn 0.5s ease;
            ">
                <div style="
                    color: gold;
                    font-size: 0.9rem;
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                ">
                    <i class="fas fa-lightbulb"></i>
                    Sugestão de Correção
                </div>
                <div style="color: #ffd700; font-size: 0.9rem;">
                    Talvez você quis dizer: 
                    <a href="${error.fullCorrection}" style="
                        color: white;
                        text-decoration: underline;
                        font-weight: bold;
                    ">${error.fullCorrection}</a>
                </div>
            </div>
        `;
        
        // Adiciona após o elemento da URL
        if (elements.currentUrl.parentNode) {
            elements.currentUrl.parentNode.insertAdjacentHTML('beforeend', correctionHtml);
        }
    }
    
    /**
     * Sistema de busca inteligente
     */
    function setupSearch() {
        if (!elements.searchForm || !config.searchEnabled) return;
        
        elements.searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = elements.searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
        
        // Autocompletar baseado em histórico
        if (config.localStorageEnabled) {
            setupSearchAutocomplete();
        }
    }
    
    /**
     * Executa a busca
     */
    function performSearch(searchTerm) {
        // Animação do botão
        animateSearchButton(true);
        
        // Salva no histórico
        saveToSearchHistory(searchTerm);
        
        // Busca inteligente
        const results = intelligentSearch(searchTerm);
        
        // Mostra resultados
        setTimeout(() => {
            handleSearchResults(results, searchTerm);
            animateSearchButton(false);
        }, config.animationSpeed);
    }
    
    /**
     * Busca inteligente nas páginas
     */
    function intelligentSearch(searchTerm) {
        const results = [];
        const searchWords = searchTerm.split(' ');
        
        sitePages.forEach(page => {
            let relevance = 0;
            
            // Verifica correspondência exata
            if (page.title.toLowerCase().includes(searchTerm)) {
                relevance += 100;
            }
            
            // Verifica por palavras-chave
            page.keywords.forEach(keyword => {
                if (searchTerm.includes(keyword)) {
                    relevance += 50;
                }
                
                searchWords.forEach(word => {
                    if (keyword.includes(word)) {
                        relevance += 10;
                    }
                });
            });
            
            // Verifica descrição
            if (page.description.toLowerCase().includes(searchTerm)) {
                relevance += 20;
            }
            
            if (relevance > 0) {
                results.push({
                    page: page,
                    relevance: relevance,
                    matchType: getMatchType(searchTerm, page)
                });
            }
        });
        
        // Ordena por relevância
        results.sort((a, b) => b.relevance - a.relevance);
        
        return results;
    }
    
    /**
     * Determina o tipo de correspondência
     */
    function getMatchType(searchTerm, page) {
        if (page.title.toLowerCase().includes(searchTerm)) {
            return 'title';
        }
        
        if (page.keywords.some(keyword => searchTerm === keyword)) {
            return 'exact-keyword';
        }
        
        if (page.keywords.some(keyword => searchTerm.includes(keyword))) {
            return 'keyword';
        }
        
        return 'partial';
    }
    
    /**
     * Processa resultados da busca
     */
    function handleSearchResults(results, searchTerm) {
        if (results.length > 0) {
            // Mostra os 3 melhores resultados
            showSearchResults(results.slice(0, 3), searchTerm);
        } else {
            // Nenhum resultado encontrado
            showNoResults(searchTerm);
        }
    }
    
    /**
     * Mostra resultados da busca
     */
    function showSearchResults(results, searchTerm) {
        const resultsHtml = `
            <div class="search-results" style="
                background: rgba(139, 0, 0, 0.1);
                border: 1px solid rgba(178, 34, 34, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin-top: 20px;
                animation: fadeIn 0.5s ease;
            ">
                <div style="
                    color: var(--accent-red);
                    font-size: 1.1rem;
                    font-weight: bold;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-search"></i>
                    Resultados para "${searchTerm}"
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${results.map((result, index) => `
                        <div class="search-result-item" style="
                            background: rgba(255, 255, 255, 0.05);
                            padding: 15px;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            border-left: 3px solid var(--accent-red);
                        " onclick="window.location.href='${result.page.url}'">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    background: rgba(139, 0, 0, 0.2);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: var(--accent-red);
                                    font-size: 1.2rem;
                                ">
                                    <i class="${result.page.icon}"></i>
                                </div>
                                <div style="flex: 1;">
                                    <div style="
                                        color: white;
                                        font-weight: bold;
                                        font-size: 1.1rem;
                                        margin-bottom: 5px;
                                    ">
                                        ${result.page.title}
                                        <span style="
                                            background: ${getRelevanceColor(result.relevance)};
                                            color: white;
                                            font-size: 0.7rem;
                                            padding: 2px 8px;
                                            border-radius: 10px;
                                            margin-left: 10px;
                                        ">
                                            ${Math.min(100, result.relevance)}% relevante
                                        </span>
                                    </div>
                                    <div style="color: var(--text-gray); font-size: 0.9rem;">
                                        ${result.page.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Remove resultados anteriores
        const previousResults = document.querySelector('.search-results');
        if (previousResults) {
            previousResults.remove();
        }
        
        // Insere novos resultados
        elements.searchForm.insertAdjacentHTML('afterend', resultsHtml);
        
        // Anima a entrada
        const newResults = document.querySelector('.search-results');
        if (newResults) {
            newResults.style.opacity = '0';
            newResults.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                newResults.style.transition = 'all 0.5s ease';
                newResults.style.opacity = '1';
                newResults.style.transform = 'translateY(0)';
            }, 10);
        }
    }
    
    /**
     * Mostra mensagem quando não há resultados
     */
    function showNoResults(searchTerm) {
        const noResultsHtml = `
            <div class="no-results" style="
                background: rgba(139, 0, 0, 0.1);
                border: 1px solid rgba(178, 34, 34, 0.3);
                border-radius: 15px;
                padding: 25px;
                margin-top: 20px;
                text-align: center;
                animation: fadeIn 0.5s ease;
            ">
                <div style="
                    color: var(--accent-red);
                    font-size: 3rem;
                    margin-bottom: 15px;
                ">
                    <i class="fas fa-search-minus"></i>
                </div>
                <div style="
                    color: white;
                    font-size: 1.2rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                ">
                    Nenhum resultado encontrado
                </div>
                <div style="color: var(--text-gray); margin-bottom: 20px;">
                    Não encontramos resultados para "<strong>${searchTerm}</strong>"
                </div>
                <div style="
                    background: rgba(255, 255, 255, 0.05);
                    padding: 15px;
                    border-radius: 10px;
                    text-align: left;
                ">
                    <div style="color: var(--accent-red); font-weight: bold; margin-bottom: 10px;">
                        <i class="fas fa-lightbulb"></i> Sugestões:
                    </div>
                    <ul style="color: var(--text-gray); padding-left: 20px; margin: 0;">
                        <li>Verifique a ortografia</li>
                        <li>Tente termos mais gerais</li>
                        <li>Explore as sugestões abaixo</li>
                        <li>Visite nossa <a href="navegacao.html" style="color: var(--accent-red);">página de navegação</a></li>
                    </ul>
                </div>
            </div>
        `;
        
        // Remove resultados anteriores
        const previousResults = document.querySelector('.search-results, .no-results');
        if (previousResults) {
            previousResults.remove();
        }
        
        // Insere mensagem
        elements.searchForm.insertAdjacentHTML('afterend', noResultsHtml);
    }
    
    /**
     * Retorna cor baseada na relevância
     */
    function getRelevanceColor(relevance) {
        if (relevance >= 80) return '#4CAF50'; // Verde
        if (relevance >= 50) return '#FF9800'; // Laranja
        return '#F44336'; // Vermelho
    }
    
    /**
     * Anima o botão de busca
     */
    function animateSearchButton(loading) {
        if (!elements.searchButton) return;
        
        if (loading) {
            elements.searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            elements.searchButton.style.background = 'rgba(139, 0, 0, 0.5)';
            elements.searchButton.style.borderColor = 'var(--accent-red)';
            elements.searchButton.disabled = true;
        } else {
            elements.searchButton.innerHTML = '<i class="fas fa-search"></i> Buscar';
            elements.searchButton.style.background = '';
            elements.searchButton.style.borderColor = '';
            elements.searchButton.disabled = false;
        }
    }
    
    /**
     * Configura autocompletar da busca
     */
    function setupSearchAutocomplete() {
        if (!elements.searchInput) return;
        
        // Carrega histórico de buscas
        const searchHistory = getSearchHistory();
        
        // Adiciona sugestões
        elements.searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) return;
            
            // Busca sugestões no histórico
            const suggestions = searchHistory.filter(item => 
                item.toLowerCase().includes(value)
            ).slice(0, 5);
            
            // Adiciona sugestões das páginas
            sitePages.forEach(page => {
                page.keywords.forEach(keyword => {
                    if (keyword.includes(value) && !suggestions.includes(keyword)) {
                        suggestions.push(keyword);
                    }
                });
            });
            
            // Mostra sugestões
            showSearchSuggestions(suggestions.slice(0, 5), value);
        });
    }
    
    /**
     * Mostra sugestões de busca
     */
    function showSearchSuggestions(suggestions, currentValue) {
        // Remove sugestões anteriores
        removeSearchSuggestions();
        
        if (suggestions.length === 0) return;
        
        const suggestionsHtml = `
            <div class="search-suggestions" style="
                position: absolute;
                background: rgba(26, 26, 26, 0.95);
                border: 1px solid rgba(139, 0, 0, 0.3);
                border-radius: 10px;
                margin-top: 5px;
                width: calc(100% - 40px);
                max-width: 560px;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            ">
                ${suggestions.map(suggestion => `
                    <div class="search-suggestion" style="
                        padding: 12px 15px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    " onclick="document.getElementById('searchInput').value = '${suggestion}'; document.querySelector('.search-button').click();">
                        <i class="fas fa-search" style="color: var(--text-gray); font-size: 0.9rem;"></i>
                        <span style="color: var(--text-gray);">${highlightMatch(suggestion, currentValue)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insere sugestões
        elements.searchForm.style.position = 'relative';
        elements.searchForm.insertAdjacentHTML('beforeend', suggestionsHtml);
    }
    
    /**
     * Remove sugestões de busca
     */
    function removeSearchSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }
    
    /**
     * Destaca correspondência no texto
     */
    function highlightMatch(text, match) {
        const index = text.toLowerCase().indexOf(match.toLowerCase());
        if (index === -1) return text;
        
        const before = text.substring(0, index);
        const matched = text.substring(index, index + match.length);
        const after = text.substring(index + match.length);
        
        return `${before}<strong style="color: var(--accent-red);">${matched}</strong>${after}`;
    }
    
    /**
     * Salva busca no histórico
     */
    function saveToSearchHistory(searchTerm) {
        if (!config.localStorageEnabled) return;
        
        try {
            let history = JSON.parse(localStorage.getItem('fedoraSearchHistory') || '[]');
            
            // Remove se já existir
            history = history.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
            
            // Adiciona no início
            history.unshift(searchTerm);
            
            // Mantém apenas os últimos X itens
            if (history.length > config.maxSearchHistory) {
                history = history.slice(0, config.maxSearchHistory);
            }
            
            localStorage.setItem('fedoraSearchHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Não foi possível salvar no localStorage:', e);
        }
    }
    
    /**
     * Obtém histórico de buscas
     */
    function getSearchHistory() {
        if (!config.localStorageEnabled) return [];
        
        try {
            return JSON.parse(localStorage.getItem('fedoraSearchHistory') || '[]');
        } catch (e) {
            console.warn('Não foi possível ler do localStorage:', e);
            return [];
        }
    }
    
    /**
     * Configura interações dos cards de sugestão
     */
    function setupSuggestionCards() {
        if (!elements.suggestions) return;
        
        elements.suggestions.forEach((card, index) => {
            // Animação de entrada escalonada
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Efeito de hover
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            
            // Click tracking
            card.addEventListener('click', function() {
                trackUserAction('suggestion_click', {
                    suggestion_index: index,
                    suggestion_text: this.querySelector('h4').textContent
                });
            });
        });
    }
    
    /**
     * Configura animações especiais
     */
    function setupSpecialAnimations() {
        if (elements.errorIcon) {
            // Interação com o ícone de erro
            elements.errorIcon.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(10deg)';
            });
            
            elements.errorIcon.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
            
            // Click para reiniciar animação
            elements.errorIcon.addEventListener('click', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'float 6s ease-in-out infinite, rotate 20s linear infinite';
                }, 10);
            });
        }
        
        if (elements.errorCode) {
            // Efeito de digitação no código 404 (opcional)
            typewriterEffect(elements.errorCode, '404', 100);
        }
    }
    
    /**
     * Efeito de máquina de escrever
     */
    function typewriterEffect(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    /**
     * Configura botões de ação
     */
    function setupActionButtons() {
        if (!elements.actionButtons) return;
        
        elements.actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase();
                
                trackUserAction('button_click', {
                    button_text: this.textContent,
                    action_type: action
                });
                
                // Efeito visual ao clicar
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, config.animationSpeed);
            });
        });
    }
    
    /**
     * Rastreamento de ações do usuário (analytics)
     */
    function trackUserAction(action, data = {}) {
        if (!config.analyticsEnabled) return;
        
        const analyticsData = {
            action: action,
            data: data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        };
        
        console.log('📊 Analytics:', analyticsData);
        
        // Em um ambiente real, enviaria para um servidor
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(analyticsData)
        // });
        
        // Salva localmente (para debug)
        saveToLocalAnalytics(analyticsData);
    }
    
    /**
     * Salva analytics localmente
     */
    function saveToLocalAnalytics(data) {
        if (!config.localStorageEnabled) return;
        
        try {
            let analytics = JSON.parse(localStorage.getItem('fedoraAnalytics') || '[]');
            analytics.push(data);
            
            // Mantém apenas os últimos 100 eventos
            if (analytics.length > 100) {
                analytics = analytics.slice(-100);
            }
            
            localStorage.setItem('fedoraAnalytics', JSON.stringify(analytics));
        } catch (e) {
            console.warn('Não foi possível salvar analytics:', e);
        }
    }
    
    /**
     * Reporta erro 404 para o servidor (opcional)
     */
    function report404Error() {
        const errorData = {
            type: '404_error',
            requested_url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };
        
        console.log('🚨 404 Error Report:', errorData);
        
        // Em um ambiente real:
        // fetch('/api/report-404', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorData)
        // });
    }
    
    /**
     * Detecta e reporta links quebrados
     */
    function detectBrokenLinks() {
        // Verifica se veio de uma página interna
        if (document.referrer && document.referrer.includes(window.location.hostname)) {
            console.log('🔗 Link quebrado detectado de:', document.referrer);
            
            // Pode enviar para um serviço de monitoramento
            trackUserAction('broken_link_from_internal', {
                from: document.referrer,
                to: window.location.href
            });
        }
    }
    
    /**
     * Inicializa todos os componentes
     */
    function initialize() {
        console.log('🚀 Inicializando 404 Script...');
        
        // Inicializa componentes na ordem correta
        displayCurrentUrl();
        setupSearch();
        setupSuggestionCards();
        setupSpecialAnimations();
        setupActionButtons();
        
        // Reporta e detecta
        report404Error();
        detectBrokenLinks();
        
        // Track página carregada
        trackUserAction('page_loaded');
        
        console.log('✅ 404 Script Inicializado com Sucesso!');
    }
    
    // ============================
    // 5. INICIALIZAÇÃO
    // ============================
    
    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // ============================
    // 6. FUNÇÕES GLOBAIS (para acesso externo)
    // ============================
    
    // Torna algumas funções acessíveis globalmente
    window.Fedora404 = {
        // Funções principais
        search: performSearch,
        track: trackUserAction,
        getHistory: getSearchHistory,
        clearHistory: function() {
            if (config.localStorageEnabled) {
                localStorage.removeItem('fedoraSearchHistory');
                localStorage.removeItem('fedoraAnalytics');
                console.log('🗑️ Histórico limpo!');
                return true;
            }
            return false;
        },
        
        // Configurações
        config: config,
        
        // Dados
        pages: sitePages,
        
        // Debug
        debug: function() {
            console.log('🔧 Debug Info:');
            console.log('- Config:', config);
            console.log('- Search History:', getSearchHistory());
            console.log('- Current URL:', window.location.href);
            console.log('- Referrer:', document.referrer);
        }
    };
    
});

// Adiciona estilos CSS dinâmicos
(function() {
    const styles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .search-result-item:hover {
            background: rgba(139, 0, 0, 0.2) !important;
            transform: translateX(5px) !important;
        }
        
        .search-suggestion:hover {
            background: rgba(139, 0, 0, 0.2) !important;
        }
        
        .url-correction a:hover {
            text-decoration: none !important;
            color: #ff6666 !important;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();

// Polyfill para navegadores antigos
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Detecta se está offline
if (!navigator.onLine) {
    console.warn('⚠️ Usuário está offline');
    document.addEventListener('DOMContentLoaded', function() {
        const offlineMessage = document.createElement('div');
        offlineMessage.style.cssText = `
            background: rgba(255, 152, 0, 0.2);
            border: 1px solid rgba(255, 152, 0, 0.4);
            color: #FF9800;
            padding: 10px;
            border-radius: 10px;
            margin: 10px 0;
            text-align: center;
            animation: pulse 2s infinite;
        `;
        offlineMessage.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <strong>Você está offline.</strong>
            Algumas funcionalidades podem não estar disponíveis.
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(offlineMessage, container.firstChild);
        }
    });
}