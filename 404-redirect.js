// 404-redirect.js
// Script de Redirecionamento Automático para Página 404 da Classic Fedora

(function() {
    'use strict';
    
    // ============================
    // CONFIGURAÇÕES
    // ============================
    const CONFIG = {
        // URLs válidas do site (páginas que existem)
        VALID_PAGES: [
            '/',                    // Página principal
            '/index.html',          // Index
            '/index',               // Index sem extensão
            '/artigo.html',         // Página de artigo
            '/artigo',              // Artigo sem extensão
            '/biblioteca.html',     // Biblioteca de artigos
            '/biblioteca',          // Biblioteca sem extensão
            '/suporte.html',        // Central de suporte
            '/suporte',             // Suporte sem extensão
            '/navegacao.html',      // Página de navegação
            '/navegacao',           // Navegação sem extensão
            '/404.html',            // Página de erro
            '/404',                 // Erro sem extensão
            // Adicione aqui todas as suas páginas válidas
        ],
        
        // Extensões de arquivo válidas
        VALID_EXTENSIONS: ['.html', '.htm', '.php', '.asp', '.aspx', '.jsp'],
        
        // Parâmetros de URL permitidos (não geram 404)
        ALLOWED_PARAMS: ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid'],
        
        // URLs para ignorar (não redirecionar para 404)
        IGNORE_PATTERNS: [
            /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i, // Arquivos estáticos
            /^\/api\//,               // APIs
            /^\/admin\//,             // Admin (se houver)
            /^\/wp-admin\//,          // WordPress admin
            /^\/wp-content\//,        // WordPress content
            /^\/wp-includes\//,       // WordPress includes
            /^\/robots\.txt$/i,       // Robots.txt
            /^\/sitemap\.xml$/i,      // Sitemap
            /^\/favicon\.ico$/i,      // Favicon
            /^\/manifest\.json$/i,    // Manifest
        ],
        
        // Redirecionamento automático (true = redireciona, false = só registra)
        AUTO_REDIRECT: true,
        
        // Mostrar console logs
        DEBUG: true,
        
        // Tempo antes do redirecionamento (ms)
        REDIRECT_DELAY: 100,
        
        // Tentar correções automáticas de URL
        AUTO_FIX: true,
        
        // Histórico de erros (localStorage)
        ERROR_HISTORY_SIZE: 50,
    };
    
    // ============================
    // FUNÇÕES DE VALIDAÇÃO
    // ============================
    
    /**
     * Verifica se a URL atual é válida
     */
    function isValidUrl() {
        const currentPath = window.location.pathname;
        const currentUrl = window.location.href;
        
        // Log inicial
        if (CONFIG.DEBUG) {
            console.log('🔍 Verificando URL:', {
                pathname: currentPath,
                fullUrl: currentUrl,
                search: window.location.search,
                hash: window.location.hash
            });
        }
        
        // 1. Verifica se é uma URL para ignorar
        if (isIgnoredUrl(currentPath)) {
            if (CONFIG.DEBUG) console.log('✅ URL ignorada (padrão permitido)');
            return true;
        }
        
        // 2. Verifica se é uma página válida na lista
        if (CONFIG.VALID_PAGES.includes(currentPath) || 
            CONFIG.VALID_PAGES.includes(currentPath + '.html') ||
            CONFIG.VALID_PAGES.includes(currentPath.replace('.html', ''))) {
            if (CONFIG.DEBUG) console.log('✅ URL válida (na lista)');
            return true;
        }
        
        // 3. Verifica se tem extensão inválida
        if (hasInvalidExtension(currentPath)) {
            if (CONFIG.DEBUG) console.log('❌ Extensão inválida');
            return false;
        }
        
        // 4. Verifica padrões específicos
        if (isSpecialCase(currentPath)) {
            return handleSpecialCase(currentPath);
        }
        
        // 5. URL é inválida (não está na lista)
        if (CONFIG.DEBUG) console.log('❌ URL não encontrada na lista de páginas válidas');
        return false;
    }
    
    /**
     * Verifica se a URL deve ser ignorada
     */
    function isIgnoredUrl(path) {
        return CONFIG.IGNORE_PATTERNS.some(pattern => pattern.test(path));
    }
    
    /**
     * Verifica se a URL tem extensão inválida
     */
    function hasInvalidExtension(path) {
        // Se não tem extensão, não é inválido por extensão
        if (!path.includes('.')) return false;
        
        // Pega a extensão
        const extension = path.substring(path.lastIndexOf('.'));
        
        // Se é uma extensão válida de página
        if (CONFIG.VALID_EXTENSIONS.includes(extension.toLowerCase())) {
            // Tem extensão válida, mas ainda precisa verificar se a página existe
            return false;
        }
        
        // Verifica se é um arquivo estático (ignorado)
        const staticPatterns = [
            /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|mp4|webm|mp3)$/i
        ];
        
        return !staticPatterns.some(pattern => pattern.test(path));
    }
    
    /**
     * Verifica casos especiais
     */
    function isSpecialCase(path) {
        // URLs com números (como /123)
        if (/^\/\d+$/.test(path)) return true;
        
        // URLs com parâmetros estranhos
        if (/^\/[^\/]+\?/.test(path)) return true;
        
        // URLs muito longas
        if (path.length > 100) return true;
        
        return false;
    }
    
    /**
     * Trata casos especiais
     */
    function handleSpecialCase(path) {
        // URLs numéricas (/123, /456, etc.)
        if (/^\/\d+$/.test(path)) {
            if (CONFIG.DEBUG) console.log('⚠️ URL numérica detectada');
            return false; // Considera como inválida
        }
        
        // Por padrão, considera inválida
        return false;
    }
    
    /**
     * Tenta corrigir a URL automaticamente
     */
    function tryAutoFix() {
        if (!CONFIG.AUTO_FIX) return null;
        
        const currentPath = window.location.pathname;
        const commonFixes = [
            // Remove trailing slash
            { test: /\/$/, fix: (p) => p.slice(0, -1) },
            
            // Adiciona .html
            { test: /^\/[^\.]+$/, fix: (p) => p + '.html' },
            
            // Corrige dupla extensão (.html.html)
            { test: /\.html\.html$/, fix: (p) => p.replace(/\.html\.html$/, '.html') },
            
            // Corrige case sensitivity (tudo minúsculo)
            { test: /[A-Z]/, fix: (p) => p.toLowerCase() },
            
            // Remove números no final
            { test: /-\d+$/, fix: (p) => p.replace(/-\d+$/, '') },
        ];
        
        for (const fix of commonFixes) {
            if (fix.test.test(currentPath)) {
                const fixedPath = fix.fix(currentPath);
                if (CONFIG.VALID_PAGES.includes(fixedPath) || 
                    CONFIG.VALID_PAGES.includes(fixedPath.replace('.html', ''))) {
                    
                    if (CONFIG.DEBUG) console.log('🔧 Correção automática encontrada:', fixedPath);
                    return fixedPath;
                }
            }
        }
        
        return null;
    }
    
    // ============================
    // FUNÇÕES DE REDIRECIONAMENTO
    // ============================
    
    /**
     * Redireciona para a página 404
     */
    function redirectTo404(originalUrl) {
        if (!CONFIG.AUTO_REDIRECT) {
            if (CONFIG.DEBUG) console.log('ℹ️ Modo debug: Não redirecionando para 404');
            return;
        }
        
        // Prepara URL para a página 404 com parâmetros
        const params = new URLSearchParams();
        params.set('from', encodeURIComponent(originalUrl));
        params.set('t', Date.now());
        
        // Preserva parâmetros UTM
        const currentParams = new URLSearchParams(window.location.search);
        CONFIG.ALLOWED_PARAMS.forEach(param => {
            if (currentParams.has(param)) {
                params.set(param, currentParams.get(param));
            }
        });
        
        const redirectUrl = `/404.html?${params.toString()}`;
        
        if (CONFIG.DEBUG) {
            console.log('🔄 Redirecionando para:', redirectUrl);
            console.log('⏳ Aguardando', CONFIG.REDIRECT_DELAY, 'ms...');
        }
        
        // Pequeno delay para permitir logs
        setTimeout(() => {
            // Salva no histórico antes de redirecionar
            saveErrorToHistory(originalUrl);
            
            // Redireciona
            window.location.href = redirectUrl;
        }, CONFIG.REDIRECT_DELAY);
    }
    
    /**
     * Redireciona para URL corrigida
     */
    function redirectToFixedUrl(fixedPath) {
        if (!CONFIG.AUTO_REDIRECT) {
            if (CONFIG.DEBUG) console.log('ℹ️ Correção encontrada:', fixedPath);
            return;
        }
        
        const fullUrl = `${fixedPath}${window.location.search}${window.location.hash}`;
        
        if (CONFIG.DEBUG) {
            console.log('🔄 Redirecionando para URL corrigida:', fullUrl);
            console.log('⏳ Aguardando', CONFIG.REDIRECT_DELAY, 'ms...');
        }
        
        setTimeout(() => {
            window.location.href = fullUrl;
        }, CONFIG.REDIRECT_DELAY);
    }
    
    // ============================
    // HISTÓRICO E ANALYTICS
    // ============================
    
    /**
     * Salva erro no histórico (localStorage)
     */
    function saveErrorToHistory(url) {
        try {
            const history = JSON.parse(localStorage.getItem('fedora_404_history') || '[]');
            
            const errorEntry = {
                url: url,
                timestamp: new Date().toISOString(),
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                path: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash
            };
            
            // Adiciona no início do array
            history.unshift(errorEntry);
            
            // Mantém apenas os últimos X erros
            if (history.length > CONFIG.ERROR_HISTORY_SIZE) {
                history.splice(CONFIG.ERROR_HISTORY_SIZE);
            }
            
            localStorage.setItem('fedora_404_history', JSON.stringify(history));
            
            if (CONFIG.DEBUG) console.log('📝 Erro salvo no histórico');
            
        } catch (error) {
            if (CONFIG.DEBUG) console.warn('⚠️ Não foi possível salvar no histórico:', error);
        }
    }
    
    /**
     * Envia analytics do erro (se configurado)
     */
    function sendErrorAnalytics(originalUrl) {
        // Esta função pode ser conectada a Google Analytics, etc.
        const analyticsData = {
            event: '404_error',
            url: originalUrl,
            referrer: document.referrer,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };
        
        if (CONFIG.DEBUG) console.log('📊 Analytics do erro:', analyticsData);
        
        // Exemplo com Google Analytics (descomente se usar GA)
        /*
        if (typeof gtag !== 'undefined') {
            gtag('event', '404_error', {
                'event_category': 'Error',
                'event_label': originalUrl,
                'value': 1
            });
        }
        */
        
        // Exemplo com fetch para seu backend
        /*
        fetch('/api/log-404', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analyticsData)
        }).catch(err => console.warn('⚠️ Falha ao enviar analytics:', err));
        */
    }
    
    // ============================
    // FUNÇÕES DE DEBUG
    // ============================
    
    /**
     * Mostra informações de debug
     */
    function showDebugInfo() {
        if (!CONFIG.DEBUG) return;
        
        console.log('🔧 Classic Fedora 404 Redirect');
        console.log('==============================');
        console.log('Versão: 1.0.0');
        console.log('Configurações:', CONFIG);
        console.log('URL Atual:', window.location.href);
        console.log('Referrer:', document.referrer);
        console.log('User Agent:', navigator.userAgent);
        console.log('==============================');
    }
    
    /**
     * Cria uma interface de debug no site (apenas em desenvolvimento)
     */
    function createDebugInterface() {
        if (!CONFIG.DEBUG || window.location.hostname !== 'localhost') return;
        
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(139, 0, 0, 0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
            border: 1px solid #ff4444;
        `;
        
        debugDiv.innerHTML = `
            <strong>🔧 404 Redirect Debug</strong><br>
            URL: ${window.location.pathname}<br>
            Status: ${isValidUrl() ? '✅ Válida' : '❌ Inválida'}<br>
            <button onclick="window.location.reload()" style="margin-top:5px; padding:2px 5px;">Testar Novamente</button>
        `;
        
        document.body.appendChild(debugDiv);
    }
    
    // ============================
    // INICIALIZAÇÃO
    // ============================
    
    /**
     * Inicializa o sistema de redirecionamento
     */
    function init() {
        showDebugInfo();
        
        // Verifica se já estamos na página 404
        if (window.location.pathname.includes('404')) {
            if (CONFIG.DEBUG) console.log('ℹ️ Já na página 404, abortando...');
            return;
        }
        
        // Verifica se a URL é válida
        if (isValidUrl()) {
            if (CONFIG.DEBUG) console.log('✅ URL válida, continuando...');
            return;
        }
        
        // URL inválida detectada
        const originalUrl = window.location.href;
        
        if (CONFIG.DEBUG) {
            console.log('❌ URL inválida detectada!');
            console.log('📛 Original:', originalUrl);
        }
        
        // Tenta correção automática primeiro
        const fixedPath = tryAutoFix();
        if (fixedPath) {
            console.log('🔧 Tentando correção automática...');
            redirectToFixedUrl(fixedPath);
            return;
        }
        
        // Se não conseguiu corrigir, redireciona para 404
        console.log('🚨 Redirecionando para página 404...');
        
        // Envia analytics
        sendErrorAnalytics(originalUrl);
        
        // Redireciona
        redirectTo404(originalUrl);
    }
    
    // ============================
    // API PÚBLICA
    // ============================
    
    // Expõe funções úteis globalmente
    window.FedoraRedirect = {
        /**
         * Verifica se uma URL é válida
         * @param {string} url - URL para verificar
         * @returns {boolean}
         */
        checkUrl: function(url) {
            const tempAnchor = document.createElement('a');
            tempAnchor.href = url;
            return CONFIG.VALID_PAGES.includes(tempAnchor.pathname) || 
                   CONFIG.VALID_PAGES.includes(tempAnchor.pathname + '.html');
        },
        
        /**
         * Adiciona uma página válida dinamicamente
         * @param {string} path - Caminho da página
         */
        addValidPage: function(path) {
            if (!CONFIG.VALID_PAGES.includes(path)) {
                CONFIG.VALID_PAGES.push(path);
                if (CONFIG.DEBUG) console.log('📄 Página adicionada:', path);
            }
        },
        
        /**
         * Obtém histórico de erros 404
         * @returns {Array}
         */
        getErrorHistory: function() {
            try {
                return JSON.parse(localStorage.getItem('fedora_404_history') || '[]');
            } catch {
                return [];
            }
        },
        
        /**
         * Limpa o histórico de erros
         */
        clearErrorHistory: function() {
            localStorage.removeItem('fedora_404_history');
            if (CONFIG.DEBUG) console.log('🗑️ Histórico limpo');
        },
        
        /**
         * Força verificação da URL atual
         */
        forceCheck: function() {
            init();
        },
        
        /**
         * Configurações (somente leitura)
         */
        config: Object.freeze({...CONFIG}),
    };
    
    // ============================
    // EVENT LISTENERS
    // ============================
    
    // Detecta cliques em links para prevenir 404s
    document.addEventListener('click', function(e) {
        // Encontra o link mais próximo
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (!target) return;
        
        const href = target.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
        
        // Verifica se é um link interno
        try {
            const url = new URL(href, window.location.origin);
            if (url.origin === window.location.origin) {
                // Link interno - verifica se é válido
                if (!FedoraRedirect.checkUrl(url.pathname)) {
                    if (CONFIG.DEBUG) console.log('⚠️ Link interno inválido detectado:', href);
                    
                    // Previne a navegação
                    e.preventDefault();
                    
                    // Mostra alerta
                    if (CONFIG.DEBUG) {
                        alert(`Atenção: O link "${href}" parece levar a uma página que não existe.\n\nSerá redirecionado para a página 404.`);
                    }
                    
                    // Redireciona para 404
                    redirectTo404(url.href);
                }
            }
        } catch (error) {
            // URL inválida, ignora
        }
    });
    
    // ============================
    // EXECUÇÃO AUTOMÁTICA
    // ============================
    
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM já carregado
        setTimeout(init, 100);
    }
    
    // Cria interface de debug se estiver em localhost
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDebugInterface);
    } else {
        createDebugInterface();
    }
    
})();

// Polyfill para navegadores antigos
if (!window.URL) {
    console.warn('⚠️ URL API não suportada, carregando polyfill...');
    // Em produção, você carregaria um polyfill real
}

// Suporte para Service Worker (opcional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/404-sw.js').catch(err => {
        console.warn('⚠️ Service Worker falhou:', err);
    });
}