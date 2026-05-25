[index.html](https://github.com/user-attachments/files/28229736/index.html)
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>智能婴儿监护系统</title>
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
            transition: 0.2s;
        }
        .card .icon { font-size: 1.5rem; margin-bottom: 2px; }
        .card .label { font-size: 0.7rem; color: #888; margin-bottom: 2px; }
        .card .value { font-size: 1.3rem; font-weight: 700; color: #1a1a2e; }
        .card .unit { font-size: 0.7rem; color: #aaa; margin-left: 1px; }
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
            width: 100%; transition: 0.2s;
        }
        .btn-primary:active { transform: scale(0.96); }

        .footer { text-align: center; font-size: 0.65rem; color: #bbb; margin-top: 4px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo"><span>👶</span> 婴儿监护</div>
        <div class="status" id="connStatus">连接中</div>
    </div>

    <div class="mode-bar" id="modeBar">
        <button class="mode-btn active" onclick="setMode(0)">🤖 自动</button>
        <button class="mode-btn" onclick="setMode(1)">🎮 手动</button>
        <button class="mode-btn" onclick="setMode(2)">⚙ 设置</button>
    </div>

    <div class="grid" id="dataGrid">
        <div class="card" id="cardTemp"><div class="icon">🌡️</div><div class="label">环境温度</div><div class="value"><span id="vTemp">--</span><span class="unit">°C</span></div></div>
        <div class="card" id="cardHumi"><div class="icon">💧</div><div class="label">环境湿度</div><div class="value"><span id="vHumi">--</span><span class="unit">%</span></div></div>
        <div class="card" id="cardBody"><div class="icon">🏥</div><div class="label">婴儿体温</div><div class="value"><span id="vBody">--</span><span class="unit">°C</span></div></div>
        <div class="card" id="cardRain"><div class="icon">🚼</div><div class="label">尿床检测</div><div class="value" id="vRain" style="font-size:0.85rem;">--</div></div>
        <div class="card" id="cardVoice"><div class="icon">📢</div><div class="label">啼哭检测</div><div class="value" id="vVoice" style="font-size:0.85rem;">--</div></div>
        <div class="card" id="cardStrike"><div class="icon">⚠️</div><div class="label">撞击检测</div><div class="value" id="vStrike" style="font-size:0.85rem;">--</div></div>
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

<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<script>
// ==================== OneNET MQTT 配置 ====================
const MQTT_CONFIG = {
    server: 'wss://mqtt.ln.cmcconenet.com:443/mqtt',
    productId: '2S7uZdUY68',
    deviceName: 'stm32_baby_cot',      
    password: 'TUZNWTBwcEppa2NqWmFJTDdqb1JIc2FVQXlpQUlYUGM='            
};

const clientId = `${MQTT_CONFIG.productId}:${MQTT_CONFIG.deviceName}`;

let currentMode = 0;
let deviceState = { fan: false, heater: false, crib: false, music: false };
let lastData = { voice: 0, rain: 0, strike: 0 };
let client = null;

const TOPIC_PROPERTY_SET = `$sys/${MQTT_CONFIG.productId}/${MQTT_CONFIG.deviceName}/thing/property/set`;
const TOPIC_PROPERTY_REPORT = `$sys/${MQTT_CONFIG.productId}/${MQTT_CONFIG.deviceName}/thing/property/post`;

function connectMQTT() {
    if (client && client.connected) return;
    
    client = mqtt.connect(MQTT_CONFIG.server, {
        clientId: clientId,
        username: MQTT_CONFIG.productId,
        password: MQTT_CONFIG.password,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
    });

    client.on('connect', () => {
        document.getElementById('connStatus').className = 'status online';
        document.getElementById('connStatus').textContent = '🟢 在线';
        addLog('MQTT 连接成功', 'info');
        client.subscribe(TOPIC_PROPERTY_REPORT);
    });

    client.on('message', (topic, message) => {
        if (topic === TOPIC_PROPERTY_REPORT) {
            try {
                const payload = JSON.parse(message.toString());
                // 适配你的数据格式：数据在 params 里
                const data = payload.params || payload;
                updateDisplay(data);
            } catch(e) {
                console.error('解析消息失败:', e);
            }
        }
    });

    client.on('error', (err) => {
        document.getElementById('connStatus').className = 'status offline';
        document.getElementById('connStatus').textContent = '🔴 离线';
        addLog(`MQTT 错误: ${err.message}`, 'danger');
    });

    client.on('close', () => {
        document.getElementById('connStatus').className = 'status offline';
        document.getElementById('connStatus').textContent = '🔴 离线';
    });
}

function sendCommand(commandData) {
    if (!client || !client.connected) {
        alert('MQTT 未连接');
        return;
    }
    const payload = { id: Date.now().toString(), version: '1.0', params: commandData };
    client.publish(TOPIC_PROPERTY_SET, JSON.stringify(payload), { qos: 1 });
}

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach((btn, i) => btn.classList.toggle('active', i === mode));
    document.getElementById('manualPanel').style.display = mode === 1 ? 'block' : 'none';
    document.getElementById('thresholdPanel').style.display = mode === 2 ? 'block' : 'none';
    addLog(`切换至 ${['自动', '手动', '设置'][mode]}模式`, 'info');
    sendCommand({ mode: mode });
}

function toggleSwitch(device) {
    if (currentMode !== 1) { alert('请先切换至手动模式'); return; }
    deviceState[device] = !deviceState[device];
    const ids = { fan: 'swFan', heater: 'swHeater', crib: 'swCrib', music: 'swMusic' };
    document.getElementById(ids[device]).classList.toggle('on', deviceState[device]);
    sendCommand({ [device]: deviceState[device] });
    addLog(`手动${deviceState[device] ? '开启' : '关闭'} ${device}`, 'warning');
}

function updateThr() {
    document.getElementById('thrTempHVal').textContent = document.getElementById('thrTempH').value + '°C';
    document.getElementById('thrTempLVal').textContent = document.getElementById('thrTempL').value + '°C';
    document.getElementById('thrHumiVal').textContent = document.getElementById('thrHumi').value + '%';
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

// ==================== 核心：适配你的数据格式 ====================
function updateDisplay(data) {
    // 你的数据格式: {"id":"xxx","params":{"temperature":{"value":25}, "humidity":{"value":55}, ...}}
    const params = data.params || data;
    
    // 提取数值（兼容多种格式：{"value":25} 或 直接 25）
    const temp = params.temperature?.value ?? params.temperature ?? '--';
    const humi = params.humidity?.value ?? params.humidity ?? '--';
    const body = params.obj_temp?.value ?? params.obj_temp ?? '--';
    const rain = params.rain?.value ?? params.rain;
    const voice = params.voice?.value ?? params.voice;
    const strike = params.strike?.value ?? params.strike;
    
    // 更新界面
    document.getElementById('vTemp').textContent = temp;
    document.getElementById('vHumi').textContent = humi;
    document.getElementById('vBody').textContent = body;
    document.getElementById('vRain').textContent = (rain === 1 || rain === "1") ? '⚠️ 是' : '✅ 否';
    document.getElementById('vVoice').textContent = (voice === 1 || voice === "1") ? '🔊 哭闹' : '🔇 安静';
    document.getElementById('vStrike').textContent = (strike === 1 || strike === "1") ? '💥 撞击' : '✅ 安全';

    // 告警样式
    document.getElementById('cardTemp').classList.toggle('alert', temp > 35);
    document.getElementById('cardBody').classList.toggle('alert', body > 37.5);
    document.getElementById('cardRain').classList.toggle('alert', rain === 1);
    document.getElementById('cardVoice').classList.toggle('alert', voice === 1);
    document.getElementById('cardStrike').classList.toggle('alert', strike === 1);

    // 事件日志（只在状态变化时记录）
    if (voice === 1 && lastData.voice !== 1) addLog('🔊 检测到婴儿啼哭', 'warning');
    if (rain === 1 && lastData.rain !== 1) addLog('🚼 检测到尿床', 'danger');
    if (strike === 1 && lastData.strike !== 1) addLog('💥 检测到撞击', 'danger');
    
    // 保存当前状态用于下次比较
    lastData = { voice: voice, rain: rain, strike: strike };
}

// ==================== 初始化 ====================
updateThr();
connectMQTT();
addLog('系统初始化完成（MQTT模式，已适配数据格式）', 'info');
</script>
</body>
</html>
