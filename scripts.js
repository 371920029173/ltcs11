const messageInput = document.getElementById('messageInput');
const fileInput = document.getElementById('fileInput');
const sendButton = document.getElementById('sendButton');
const displayArea = document.querySelector('.display-area');

let chatLog = [];
const githubToken = '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'; // 替换为你的GitHub个人访问令牌
const githubRepo = '371920029173/ltcs11'; // 替换为你的GitHub用户名和仓库名
const githubBranch = 'main'; // 仓库分支名
const githubFilePath = 'chatlog.json'; // 文件路径

// 发送文本消息
function sendMessage() {
    const message = messageInput.value;
    if (message) {
        const newMessage = { type: 'text', content: message, timestamp: new Date().toISOString() };
        chatLog.push(newMessage);
        displayMessage(newMessage);
        messageInput.value = '';
        saveChatLogToGitHub(); // 保存聊天记录到GitHub
    }
}

// 发送文件
function sendFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            const newMessage = { type: 'file', content: fileContent, timestamp: new Date().toISOString(), fileName: file.name };
            chatLog.push(newMessage);
            displayMessage(newMessage);
            saveChatLogToGitHub(); // 保存聊天记录到GitHub
        };
        reader.readAsDataURL(file);
    });
}

// 显示消息
function displayMessage(message) {
    const messageElement = document.createElement('div');
    if (message.type === 'text') {
        messageElement.textContent = `${message.content} - ${message.timestamp}`;
    } else if (message.type === 'file') {
        messageElement.innerHTML = `<a href="${message.content}" target="_blank">查看文件: ${message.fileName}</a> - ${message.timestamp}`;
    }
    displayArea.appendChild(messageElement);
}

// 保存聊天记录到GitHub
async function saveChatLogToGitHub() {
    const chatLogJson = JSON.stringify(chatLog);
    const content = Buffer.from(chatLogJson).toString('base64');

    try {
        const response = await fetch(`https://api.github.com/repos/${371920029173/ltcs11}/contents/${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}?ref=${main}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${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}`
            }
        });

        if (response.status === 404) {
            // 文件不存在，进行首次提交
            await createNewFile(content);
        } else {
            // 文件存在，更新文件
            const data = await response.json();
            await updateFile(data.sha, content);
        }
    } catch (error) {
        console.error('Error saving chat log to GitHub:', error);
    }
}

// 创建新文件
async function createNewFile(content) {
    const response = await fetch(`https://api.github.com/repos/${371920029173/ltcs11}/contents/${chaylog.json}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${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}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Initial commit for chat log',
            content: content,
            branch: githubBranch
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to create new file: ${response.statusText}`);
    }
}

// 更新现有文件
async function updateFile(sha, content) {
    const response = await fetch(`https://api.github.com/repos/${371920029173/ltcs11}/contents/${chaylog.json}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${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}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update chat log',
            content: content,
            branch: githubBranch,
            sha: sha
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update file: ${response.statusText}`);
    }
}

// 监听事件
sendButton.addEventListener('click', () => {
    if (messageInput.value) {
        sendMessage();
    } else if (fileInput.files.length) {
        sendFiles(fileInput.files);
    }
});

fileInput.addEventListener('change', () => {
    sendFiles(fileInput.files);
});