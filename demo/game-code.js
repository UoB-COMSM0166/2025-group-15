// 玩家对象，包含位置、大小、速度、生命值、分数等属性
let player = {
    x: 700,          // 玩家初始x坐标
    y: 300,          // 玩家初始y坐标
    size: 20,        // 玩家大小
    speed: 4,        // 移动速度
    lives: 3,        // 生命值
    score: 0,        // 分数
    hasItem: false,  // 是否携带货物
    currentItem: null // 当前携带的货物对象
};

// 车辆对象，分为两个车道
let cars = {
    lane1: [], // 向下行驶的车道
    lane2: []  // 向上行驶的车道
};

// 游戏中的各种物品数组
let items = [];          // 待搬运的货物
let deliveredItems = []; // 已送达的货物
let gameTime = 60;       // 游戏时间（秒）
let gameOver = false;    // 游戏是否结束
let startTime;          // 游戏开始时间
let keys = {};          // 按键状态对象

// 游戏常量
const LANE1_X = 300;            // 第一车道x坐标
const LANE2_X = 450;            // 第二车道x坐标
const MIN_CAR_DISTANCE = 150;    // 车辆最小间距
const DELIVERY_START_Y = 100;    // 送达区起始y坐标
const DELIVERY_X = 650;          // 送达区x坐标

/**
 * p5.js setup函数，游戏初始化
 */
function setup() {
    createCanvas(800, 600);     // 创建画布
    startTime = millis();       // 记录开始时间
    generateInitialItems();     // 生成初始货物
}

/**
 * 生成初始货物
 * 在左侧仓库区域生成5个均匀分布的随机价值货物
 */
function generateInitialItems() {
    for(let i = 0; i < 5; i++) {
        items.push({
            x: random(50, 200),
            y: 100 + i * 80,          // 垂直均匀分布
            value: floor(random(10, 50)), // 随机价值10-50
            size: 15
        });
    }
}

/**
 * 检查是否可以在指定车道生成新车辆
 * @param {number} lane - 车道编号（1或2）
 * @param {number} y - 生成位置的y坐标
 * @param {number} direction - 行驶方向（1向下，-1向上）
 * @returns {boolean} - 是否可以生成新车辆
 */
function canGenerateCar(lane, y, direction) {
    const carArray = lane === 1 ? cars.lane1 : cars.lane2;
    
    // 检查与现有车辆的距离
    for (let car of carArray) {
        if (direction > 0) {
            // 向下行驶的车道
            const distance = y - car.y;
            if (Math.abs(distance) < MIN_CAR_DISTANCE) return false;
            // 防止新车超过前车
            if (car.y < y && car.speed < carArray[carArray.length - 1]?.speed) return false;
        } else {
            // 向上行驶的车道
            const distance = car.y - y;
            if (Math.abs(distance) < MIN_CAR_DISTANCE) return false;
            // 防止新车超过前车
            if (car.y > y && car.speed < carArray[carArray.length - 1]?.speed) return false;
        }
    }
    return true;
}

/**
 * p5.js draw函数，游戏主循环
 * 处理游戏逻辑和绘制
 */
function draw() {
    background(200);
    
    // 绘制游戏区域
    fill(150);
    rect(0, 0, 250, height);    // 左侧仓库
    fill(100);
    rect(250, 0, 300, height);  // 中间马路
    fill(150);
    rect(550, 0, 250, height);  // 右侧送达区

    // 更新游戏时间
    if (!gameOver) {
        gameTime = 60 - floor((millis() - startTime) / 1000);
    }
    
    // 生成新车辆（每60帧尝试生成一次）
    if (frameCount % 60 === 0 && !gameOver) {
        if (canGenerateCar(1, -50, 1)) {
            cars.lane1.push({
                x: LANE1_X,
                y: -50,
                speed: random(3, 7)
            });
        }
        if (canGenerateCar(2, height + 50, -1)) {
            cars.lane2.push({
                x: LANE2_X,
                y: height + 50,
                speed: random(3, 7)
            });
        }
    }
    
    // 更新和绘制第一车道的车辆
    for (let i = cars.lane1.length - 1; i >= 0; i--) {
        let car = cars.lane1[i];
        car.y += car.speed;
        
        fill(255, 0, 0);
        rect(car.x, car.y, 30, 50);
        
        // 检查与玩家的碰撞
        if (!gameOver && dist(player.x, player.y, car.x + 15, car.y + 25) < 30) {
            handleCollision();
        }
        
        // 移除超出屏幕的车辆
        if (car.y > height + 50) {
            cars.lane1.splice(i, 1);
        }
    }
    
    // 更新和绘制第二车道的车辆
    for (let i = cars.lane2.length - 1; i >= 0; i--) {
        let car = cars.lane2[i];
        car.y -= car.speed;
        
        fill(255, 0, 0);
        rect(car.x, car.y, 30, 50);
        
        // 检查与玩家的碰撞
        if (!gameOver && dist(player.x, player.y, car.x + 15, car.y + 25) < 30) {
            handleCollision();
        }
        
        // 移除超出屏幕的车辆
        if (car.y < -100) {
            cars.lane2.splice(i, 1);
        }
    }
    
    // 绘制待搬运的货物
    for (let item of items) {
        fill(0, 255, 0);
        rect(item.x, item.y, item.size, item.size);
        fill(0);
        textSize(12);
        text(item.value, item.x, item.y - 5);
    }
    
    // 绘制已送达的货物
    for (let i = 0; i < deliveredItems.length; i++) {
        let item = deliveredItems[i];
        fill(0, 200, 0);
        rect(DELIVERY_X, DELIVERY_START_Y + i * 30, 15, 15);
        fill(0);
        textSize(12);
        text(item.value, DELIVERY_X, DELIVERY_START_Y + i * 30 - 5);
    }
    
    // 绘制玩家
    fill(0, 0, 255);
    circle(player.x, player.y, player.size);
    if (player.hasItem) {
        fill(0, 255, 0);
        rect(player.x - 5, player.y - 5, 10, 10);
    }
    
    // 处理货物拾取和送达
    if (!player.hasItem) {
        // 检查是否可以拾取货物
        for (let i = items.length - 1; i >= 0; i--) {
            let item = items[i];
            if (dist(player.x, player.y, item.x, item.y) < 20) {
                player.hasItem = true;
                player.currentItem = item;
                items.splice(i, 1);
                break;
            }
        }
    } else if (player.x > 600) {
        // 送达货物
        player.score += player.currentItem.value;
        deliveredItems.push(player.currentItem);
        player.hasItem = false;
        player.currentItem = null;
        
        // 如果所有货物都被送达，生成新的一批
        if (items.length === 0) {
            generateInitialItems();
        }
    }
    
    // 更新玩家位置
    updatePlayerPosition();
    
    // 显示游戏状态
    fill(0);
    textSize(20);
    text(`分数: ${player.score}`, 20, 30);
    text(`生命: ${player.lives}`, 20, 60);
    text(`时间: ${gameTime}`, 20, 90);
    
    // 检查游戏是否结束
    if (gameTime <= 0) {
        gameOver = true;
    }
    
    // 显示游戏结束画面
    if (gameOver) {
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text(`游戏结束!\n最终分数: ${player.score}`, width/2, height/2);
        noLoop();
    }
}

/**
 * 处理玩家碰撞事件
 * 减少生命值，扣除分数，处理携带的货物
 */
function handleCollision() {
    player.lives--;
    player.score = max(0, player.score - 20);
    if (player.hasItem) {
        // 掉落当前携带的货物
        items.push({
            x: player.x,
            y: player.y,
            value: player.currentItem.value,
            size: 15
        });
        player.hasItem = false;
        player.currentItem = null;
    }
    // 将玩家送回出生点
    player.x = 700;
    player.y = 300;
    if (player.lives <= 0) {
        gameOver = true;
    }
}

/**
 * 处理按键按下事件
 */
function keyPressed() {
    keys[keyCode] = true;
}

/**
 * 处理按键释放事件
 */
function keyReleased() {
    keys[keyCode] = false;
}

/**
 * 更新玩家位置
 * 根据当前按下的方向键移动玩家
 */
function updatePlayerPosition() {
    if (!gameOver) {
        if (keys[LEFT_ARROW]) {
            player.x -= player.speed;
        }
        if (keys[RIGHT_ARROW]) {
            player.x += player.speed;
        }
        if (keys[UP_ARROW]) {
            player.y -= player.speed;
        }
        if (keys[DOWN_ARROW]) {
            player.y += player.speed;
        }
        
        // 限制玩家在画布范围内
        player.x = constrain(player.x, 0, width);
        player.y = constrain(player.y, 0, height);
    }
}