[index.html](https://github.com/user-attachments/files/28228987/index.html)

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>智能婴儿监护系统</title>
    <!-- OneNET 官方 SDK -->
    <script src="https://open.iot.10086.cn/developer/sdk/javascript/sdk.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #e8f4f8 0%, #f0e6ff 50%, #ffe6f0 100%);
            min-height: 100vh; padding: 12px; display: flex; flex-direction: column; align-items: center;
        }
        .container { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 10px; }
        .header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 14px; background: #fff; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .logo { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; display: flex; align-items: center; gap: 6px; }
        .logo span { font-size: 1.4rem; }
        .status { font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 12px; }
        .status.online { background: #e8f5e9; color: #27ae60; }
        .status.offline { background: #fbe9e7; color: #e94560; }
        .mode-bar {
            display: flex; gap: 0; background: #fff; border-radius: 16px;
            overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .mode-btn {
            flex: 1; padding: 12px 0; text-align: center; font-size: 0.85rem;
            font-weight: 600; border: none; background: transparent; color: #888;
            cursor: pointer; transition: 0.2s;
        }
        .mode-btn.active { background: #6c5ce7; color: #fff; border-radius: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .card {
            background: #fff; border-radius: 16px; padding: 14px 10px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04); text-align: center;
        }
        .card .icon { font-size: 1.5rem; margin-bottom: 2px; }
        .card .label { font-size: 0.7rem; color: #888; margin-bottom: 2px; }
        .card .value { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; }
        .card .unit { font-size: 0.7rem; color: #aaa; }
        .card.alert { border: 2px solid #e94560; animation: shake 0.5s; }
        @keyframes shake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);} }
        .switch-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 16px; background: #fff; border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .switch-row .label { font-weight: 600; font-size: 0.9rem; }
        .switch {
            width: 52px; height: 28px; background: #ddd; border-radius: 28px;
            position: relative; cursor: pointer; transition: 0.3s;
        }
        .switch.on { background: #27ae60; }
        .switch::after {
            content: ''; width: 24px; height: 24px; background: #fff; border-radius: 50%;
            position: absolute; top: 2px; left: 2px; transition: 0.3s;
        }
        .switch.on::after { left: 26px; }
        .threshold-panel {
            background: #fff; border-radius: 16px; padding: 14px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .threshold-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
        .threshold-item input[type="range"] { width: 120px; accent-color: #6c5ce7; }
        .threshold-item .val { font-weight: 600; min-width: 40px; text-align: right; }
        .log-panel {
            background: #fff; border-radius: 16px; padding: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04); max-height: 160px; overflow-y: auto;
        }
        .log-item { font-size: 0.75rem; padding: 4px 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 8px; }
        .log-item .time { color: #aaa; white-space: nowrap; }
        .log-item.danger { color: #e94560; }
        .log-item.warning { color: #f39c12; }
        .log-item.info { color: #3498db; }
        .btn-primary {
            background: #6c5ce7; color: #fff; border: none; padding: 12px;
            border-radius: 14px; font-weight: 600; font-size: 0.9rem; cursor: pointer;
            width: 100%;
        }
        .footer { text-align: center; font-size: 0.65rem; color: #bbb; margin-top: 4px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo"><span>👶</span> 婴儿监护</div>
        <div class="status" id="connStatus">连接中</div>
    </div>

    <div class="mode-bar">
        <button class="mode-btn active" onclick="setMode(0)">🤖 自动</button>
        <button class="mode-btn" onclick="setMode(1)">🎮 手动</button>
        <button class="mode-btn" onclick="setMode(2)">⚙ 设置</button>
    </div>

    <div class="grid">
        <div class="card" id="cardTemp"><div class="icon">🌡️</div><div class="label">环境温度</div><div class="value"><span id="vTemp">--</span><span class="unit">°C</span></div></div>
        <div class="card" id="cardHumi"><div class="icon">💧</div><div class="label">环境湿度</div><div class="value"><span id="vHumi">--</span><span class="unit">%</span></div></div>
        <div class="card" id="cardBody"><div class="icon">🏥</div><div class="label">婴儿体温</div><div class="value"><span id="vBody">--</span><span class="unit">°C</span></div></div>
        <div class="card" id="cardRain"><div class="icon">🚼</div><div class="label">尿床检测</div><div class="value" id="vRain">--</div></div>
        <div class="card" id="cardVoice"><div class="icon">📢</div><div class="label">啼哭检测</div><div class="value" id="vVoice">--</div></div>
        <div class="card" id="cardStrike"><div class="icon">⚠️</div><div class="label">撞击检测</div><div class="value" id="vStrike">--</div></div>
    </div>

    <div id="manualPanel" style="display:none;">
        <div class="switch-row"><span class="label">🌀 风扇</span><div class="switch" id="swFan" onclick="toggleSwitch('fan')"></div></div>
        <div class="switch-row"><span class="label">🔥 加热片</span><div class="switch" id="swHeater" onclick="toggleSwitch('heater')"></div></div>
        <div class="switch-row"><span class="label">🛏️ 摇床</span><div class="switch" id="swCrib" onclick="toggleSwitch('crib')"></div></div>
        <div class="switch-row"><span class="label">🎵 音乐</span><div class="switch" id="swMusic" onclick="toggleSwitch('music')"></div></div>
    </div>

    <div class="threshold-panel" id="thresholdPanel" style="display:none;">
        <div class="threshold-item"><label>温度上限</label><input type="range" id="thrTempH" min="15" max="50" value="35" oninput="updateThr()"><span class="val" id="thrTempHVal">35°C</span></div>
        <div class="threshold-item"><label>温度下限</label><input type="range" id="thrTempL" min="5" max="30" value="15" oninput="updateThr()"><span class="val" id="thrTempLVal">15°C</span></div>
        <div class="threshold-item"><label>湿度阈值</label><input type="range" id="thrHumi" min="20" max="90" value="60" oninput="updateThr()"><span class="val" id="thrHumiVal">60%</span></div>
        <button class="btn-primary" onclick="saveThreshold()">💾 保存阈值</button>
    </div>

    <div class="log-panel" id="logPanel">
        <div class="log-item info"><span class="time">--:--:--</span> 系统就绪，等待数据...</div>
    </div>

    <div class="footer">© 2026 辽宁石油化工大学 · 智能婴儿监护系统</div>
</div>

<script>
    // ==================== OneNET 配置 - 请修改这里 ====================
    const PRODUCT_ID = "2S7uZdUY68";           // 产品ID
    const DEVICE_NAME = "stm32_baby_cot";      // 设备名称  
    const ACCESS_KEY = "TUZNWTBwcEppa2NqWmFJTDdqb1JIc2FVQXlpQUlYUGM="; // 【请修改】完整的设备密钥
    // ================================================================

    let currentMode = 0;
    let deviceState = { fan: false, heater: false, crib: false, music: false };
    let lastData = {};
    let pollInterval = null;
    let onenetClient = null;

    // ==================== 初始化 OneNET SDK ====================
    function initOneNET() {
        try {
            onenetClient = new OneNetClient({
                productId: PRODUCT_ID,
                deviceName: DEVICE_NAME,
                accessKey: ACCESS_KEY
            });
            console.log('OneNET SDK 初始化成功');
            addLog('SDK 初始化成功', 'info');
            return true;
        } catch (error) {
            console.error('SDK 初始化失败:', error);
            addLog('SDK 初始化失败: ' + error.message, 'danger');
            return false;
        }
    }

    // ==================== 获取设备数据 ====================
    async function fetchDeviceData() {
        if (!onenetClient) {
            console.error('SDK 未初始化');
            return;
        }

        try {
            // 批量获取设备属性
            const result = await onenetClient.getProperty([
                'temperature', 
                'humidity', 
                'obj_temp', 
                'rain', 
                'voice', 
                'strike'
            ]);
            
            console.log('获取到的设备数据:', result);
            
            // 解析 SDK 返回的数据（注意 SDK 返回的格式可能需要根据实际情况调整）
            const data = {
                temperature: result.temperature?.value || result.temperature,
                humidity: result.humidity?.value || result.humidity,
                obj_temp: result.obj_temp?.value || result.obj_temp,
                rain: result.rain?.value === 1 || result.rain === 1,
                voice: result.voice?.value === 1 || result.voice === 1,
                strike: result.strike?.value === 1 || result.strike === 1
            };
            
            updateDisplay(data);
            lastData = data;
            
            // 更新在线状态
            document.getElementById('connStatus').className = 'status online';
            document.getElementById('connStatus').textContent = '🟢 在线';
            
        } catch (error) {
            console.error('获取设备数据失败:', error);
            document.getElementById('connStatus').className = 'status offline';
            document.getElementById('connStatus').textContent = '🔴 离线';
            addLog(`获取数据失败: ${error.message}`, 'danger');
        }
    }

    // ==================== 下发控制命令 ====================
    async function sendCommand(commandData) {
        if (!onenetClient) {
            alert('SDK 未就绪');
            return false;
        }

        try {
            // 使用 SDK 设置设备属性
            const result = await onenetClient.setProperty(commandData);
            console.log('命令下发成功:', result);
            addLog(`命令已发送: ${JSON.stringify(commandData)}`, 'info');
            return true;
        } catch (error) {
            console.error('命令下发失败:', error);
            addLog(`命令下发失败: ${error.message}`, 'danger');
            return false;
        }
    }

    // ==================== 模式切换 ====================
    function setMode(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === mode);
        });
        const manualPanel = document.getElementById('manualPanel');
        const thresholdPanel = document.getElementById('thresholdPanel');
        if (manualPanel) manualPanel.style.display = mode === 1 ? 'block' : 'none';
        if (thresholdPanel) thresholdPanel.style.display = mode === 2 ? 'block' : 'none';
        addLog(`切换至 ${['自动模式', '手动模式', '设置模式'][mode]}`, 'info');
        sendCommand({ mode: mode });
    }

    // ==================== 开关控制 ====================
    function toggleSwitch(device) {
        if (currentMode !== 1) {
            alert('请先切换至手动模式');
            return;
        }
        deviceState[device] = !deviceState[device];
        updateSwitchUI(device);
        
        // 发送开关命令
        const command = {};
        command[device] = deviceState[device];
        sendCommand(command);
        
        addLog(`手动${deviceState[device] ? '开启' : '关闭'} ${device}`, 'warning');
    }

    function updateSwitchUI(device) {
        const ids = { fan: 'swFan', heater: 'swHeater', crib: 'swCrib', music: 'swMusic' };
        const el = document.getElementById(ids[device]);
        if (el) el.classList.toggle('on', deviceState[device]);
    }

    // ==================== 阈值设置 ====================
    function updateThr() {
        document.getElementById('thrTempHVal').innerHTML = document.getElementById('thrTempH').value + '°C';
        document.getElementById('thrTempLVal').innerHTML = document.getElementById('thrTempL').value + '°C';
        document.getElementById('thrHumiVal').innerHTML = document.getElementById('thrHumi').value + '%';
    }

    function saveThreshold() {
        const thresholds = {
            tempValue_H: parseInt(document.getElementById('thrTempH').value),
            tempValue_L: parseInt(document.getElementById('thrTempL').value),
            humiValue: parseInt(document.getElementById('thrHumi').value)
        };
        sendCommand({ thresholds: thresholds });
        addLog('阈值已保存', 'info');
        alert('阈值已保存 ✅');
    }

    // ==================== 日志 ====================
    function addLog(msg, type) {
        const now = new Date();
        const time = now.toLocaleTimeString('zh-CN');
        const logPanel = document.getElementById('logPanel');
        const div = document.createElement('div');
        div.className = `log-item ${type}`;
        div.innerHTML = `<span class="time">${time}</span> ${msg}`;
        logPanel.insertBefore(div, logPanel.firstChild);
        if (logPanel.children.length > 50) logPanel.removeChild(logPanel.lastChild);
    }

    // ==================== 更新界面显示 ====================
    function updateDisplay(data) {
        // 更新数值
        document.getElementById('vTemp').textContent = data.temperature !== null && data.temperature !== undefined ? data.temperature : '--';
        document.getElementById('vHumi').textContent = data.humidity !== null && data.humidity !== undefined ? data.humidity : '--';
        document.getElementById('vBody').textContent = data.obj_temp !== null && data.obj_temp !== undefined ? data.obj_temp : '--';
        document.getElementById('vRain').textContent = data.rain ? '⚠️ 是' : '✅ 否';
        document.getElementById('vVoice').textContent = data.voice ? '🔊 哭闹' : '🔇 安静';
        document.getElementById('vStrike').textContent = data.strike ? '💥 撞击' : '✅ 安全';
        
        // 告警样式
        document.getElementById('cardTemp').classList.toggle('alert', (data.temperature || 0) > 35);
        document.getElementById('cardBody').classList.toggle('alert', (data.obj_temp || 0) > 37.5);
        document.getElementById('cardRain').classList.toggle('alert', data.rain);
        document.getElementById('cardVoice').classList.toggle('alert', data.voice);
        document.getElementById('cardStrike').classList.toggle('alert', data.strike);
        
        // 事件日志
        if (data.voice && !lastData.voice) addLog('🔊 检测到婴儿啼哭', 'warning');
        if (data.rain && !lastData.rain) addLog('🚼 检测到尿床', 'danger');
        if (data.strike && !lastData.strike) addLog('💥 检测到撞击', 'danger');
    }

    // ==================== 初始化页面 ====================
    async function init() {
        updateThr();
        
        // 初始化 OneNET SDK
        const sdkReady = initOneNET();
        
        if (sdkReady) {
            // 等待1秒让SDK完全初始化
            setTimeout(() => {
                fetchDeviceData();
                // 每3秒轮询一次数据
                pollInterval = setInterval(fetchDeviceData, 3000);
            }, 1000);
        }
        
        addLog('系统初始化完成（OneNET SDK 版本）', 'info');
    }

    // 启动应用
    init();
</script>
</body>
</html>
