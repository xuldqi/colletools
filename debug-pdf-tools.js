// 调试PDF工具页面的问题
console.log('🔍 开始调试PDF工具页面...');

// 检查页面元素
function checkPageElements() {
    console.log('📋 检查页面元素...');
    
    // 检查工具列表
    const toolCards = document.querySelectorAll('[data-tool-id]');
    console.log(`找到 ${toolCards.length} 个工具卡片`);
    
    // 检查文件上传区域
    const fileUpload = document.querySelector('input[type="file"]');
    console.log('文件上传输入框:', fileUpload ? '存在' : '不存在');
    
    // 检查处理按钮
    const processButton = document.querySelector('button[onclick*="handleProcess"]');
    console.log('处理按钮:', processButton ? '存在' : '不存在');
    
    // 检查错误显示区域
    const errorArea = document.querySelector('.error, .toast-error');
    console.log('错误显示区域:', errorArea ? '存在' : '不存在');
}

// 检查API端点
async function checkAPIEndpoints() {
    console.log('🔌 检查API端点...');
    
    const endpoints = [
        '/api/tools',
        '/api/tools/pdf-to-word',
        '/api/tools/pdf-to-word/process'
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            console.log(`${endpoint}: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`${endpoint} 响应:`, data);
            }
        } catch (error) {
            console.error(`${endpoint} 错误:`, error.message);
        }
    }
}

// 检查事件监听器
function checkEventListeners() {
    console.log('🎧 检查事件监听器...');
    
    // 检查文件选择事件
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        console.log('文件输入框事件监听器:', fileInput.onchange ? '已设置' : '未设置');
    }
    
    // 检查按钮点击事件
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        console.log(`按钮 ${index}:`, {
            text: button.textContent?.trim(),
            onclick: button.onclick ? '已设置' : '未设置',
            addEventListener: button.addEventListener ? '可用' : '不可用'
        });
    });
}

// 检查控制台错误
function checkConsoleErrors() {
    console.log('🚨 检查控制台错误...');
    
    // 重写console.error来捕获错误
    const originalError = console.error;
    console.error = function(...args) {
        console.log('❌ 捕获到错误:', ...args);
        originalError.apply(console, args);
    };
    
    // 重写window.onerror
    window.onerror = function(message, source, lineno, colno, error) {
        console.log('❌ 全局错误:', {
            message,
            source,
            lineno,
            colno,
            error
        });
        return false;
    };
    
    // 重写window.onunhandledrejection
    window.onunhandledrejection = function(event) {
        console.log('❌ 未处理的Promise拒绝:', event.reason);
    };
}

// 模拟文件上传和处理
async function simulateFileUpload() {
    console.log('📁 模拟文件上传...');
    
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) {
        console.log('❌ 找不到文件输入框');
        return;
    }
    
    // 创建一个测试文件
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // 模拟文件选择
    const event = new Event('change', { bubbles: true });
    Object.defineProperty(event, 'target', { value: fileInput });
    Object.defineProperty(fileInput, 'files', { value: [testFile] });
    
    fileInput.dispatchEvent(event);
    console.log('✅ 模拟文件选择完成');
}

// 检查React组件状态
function checkReactState() {
    console.log('⚛️ 检查React状态...');
    
    // 尝试访问React组件
    const reactRoot = document.querySelector('#root');
    if (reactRoot && reactRoot._reactInternalFiber) {
        console.log('React根组件:', reactRoot._reactInternalFiber);
    } else {
        console.log('React根组件状态: 无法访问');
    }
}

// 主调试函数
function debugPDFTools() {
    console.log('🚀 开始全面调试...');
    
    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDebug);
    } else {
        runDebug();
    }
}

function runDebug() {
    console.log('📄 页面已加载，开始调试...');
    
    checkPageElements();
    checkEventListeners();
    checkConsoleErrors();
    checkReactState();
    
    // 延迟检查API端点
    setTimeout(() => {
        checkAPIEndpoints();
        simulateFileUpload();
    }, 1000);
}

// 自动运行调试
debugPDFTools();

// 导出调试函数供手动调用
window.debugPDFTools = debugPDFTools;
window.checkPageElements = checkPageElements;
window.checkAPIEndpoints = checkAPIEndpoints;
window.simulateFileUpload = simulateFileUpload;

console.log('🔧 调试脚本已加载，可以在控制台调用以下函数:');
console.log('- debugPDFTools() - 全面调试');
console.log('- checkPageElements() - 检查页面元素');
console.log('- checkAPIEndpoints() - 检查API端点');
console.log('- simulateFileUpload() - 模拟文件上传');
