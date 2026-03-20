/**
 * 轻游迹 TripLite - 回归测试脚本
 *
 * 在每次发布前自动执行，验证核心功能
 */

const fs = require('fs');
const path = require('path');

// 测试结果统计
const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
};

function log(message, type = 'info') {
    const prefix = {
        'info': 'ℹ️',
        'pass': '✅',
        'fail': '❌',
        'warn': '⚠️'
    }[type] || 'ℹ️';
    console.log(`${prefix} ${message}`);
}

function addResult(name, passed, message = '') {
    results.tests.push({ name, passed, message });
    if (passed) {
        results.passed++;
        log(name, 'pass');
    } else {
        results.failed++;
        log(`${name}: ${message}`, 'fail');
    }
}

function addWarning(name, message) {
    results.warnings++;
    log(`${name}: ${message}`, 'warn');
}

// ==================== 测试用例 ====================

function test1_checkFileSync() {
    const indexPath = path.join(__dirname, 'index.html');
    const sqlPath = path.join(__dirname, 'supabase-init.sql');

    const indexExists = fs.existsSync(indexPath);
    const sqlExists = fs.existsSync(sqlPath);

    addResult('核心文件存在性检查', indexExists && sqlExists,
        !indexExists ? 'index.html 缺失' : !sqlExists ? 'supabase-init.sql 缺失' : '');
}

function test2_checkSupabaseConfig() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasUrl = content.includes("SUPABASE_URL = 'https://ifokqgqwoquvlxyjtqlp.supabase.co'");
    const hasKey = content.includes("SUPABASE_KEY = 'sb_publishable_");

    addResult('Supabase 配置检查', hasUrl && hasKey,
        !hasUrl ? 'SUPABASE_URL 未配置' : !hasKey ? 'SUPABASE_KEY 未配置' : '');
}

function test3_checkAuthFunctions() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasHandleLogin = content.includes('async function handleLogin()');
    const hasHandleRegister = content.includes('async function handleRegister()');
    const hasGetUserId = content.includes('function getUserId()');

    addResult('认证函数存在性检查', hasHandleLogin && hasHandleRegister && hasGetUserId,
        !hasHandleLogin ? 'handleLogin 缺失' : !hasHandleRegister ? 'handleRegister 缺失' : !hasGetUserId ? 'getUserId 缺失' : '');
}

function test4_checkLoginErrorHandling() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasInvalidCredentials = content.includes('手机号或密码错误');
    const hasUserNotFound = content.includes('账号不存在');
    const hasDestructuring = content.includes('const { data, error }');

    addResult('登录错误处理检查', hasInvalidCredentials && hasUserNotFound && hasDestructuring,
        !hasInvalidCredentials ? '缺少错误提示' : !hasDestructuring ? '未使用解构赋值' : '');
}

function test5_checkRegisterFlow() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasPhoneValidation = content.includes('!phone || !password');
    const hasPasswordLength = content.includes('password.length < 6');
    const hasCodeValidation = content.includes("code !== '123456'");

    addResult('注册流程验证检查', hasPhoneValidation && hasPasswordLength && hasCodeValidation,
        !hasPhoneValidation ? '缺少手机号验证' : !hasPasswordLength ? '缺少密码长度验证' : !hasCodeValidation ? '缺少验证码验证' : '');
}

function test6_checkSQLScript() {
    const sqlPath = path.join(__dirname, 'supabase-init.sql');
    const content = fs.readFileSync(sqlPath, 'utf-8');

    const hasUserProfiles = content.includes('CREATE TABLE IF NOT EXISTS user_profiles');
    const hasTrips = content.includes('CREATE TABLE IF NOT EXISTS trips');
    const hasTripData = content.includes('CREATE TABLE IF NOT EXISTS trip_data');
    const hasTrigger = content.includes('CREATE TRIGGER on_auth_user_created');

    addResult('SQL 脚本完整性检查', hasUserProfiles && hasTrips && hasTripData && hasTrigger,
        !hasUserProfiles ? '缺少 user_profiles 表' : !hasTrips ? '缺少 trips 表' : !hasTripData ? '缺少 trip_data 表' : !hasTrigger ? '缺少触发器' : '');
}

function test7_checkBackgroundImage() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasBackground = content.includes("background: url('https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg'");

    addResult('背景图配置检查', hasBackground, '背景图 URL 未配置');
}

function test8_checkLanguageSupport() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasToggleLanguage = content.includes('function toggleLanguage()');
    const hasDataZh = content.includes('data-zh=');
    const hasDataEn = content.includes('data-en=');

    addResult('中英文支持检查', hasToggleLanguage && hasDataZh && hasDataEn,
        !hasToggleLanguage ? '缺少切换语言函数' : !hasDataZh ? '缺少中文数据' : !hasDataEn ? '缺少英文数据' : '');
}

function test9_checkTripManagement() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasRenderTripList = content.includes('async function renderTripList()');
    const hasConfirmCreateTrip = content.includes('async function confirmCreateTrip()');
    const hasGetUserIdCall = content.includes('getUserId()');

    addResult('出行计划管理检查', hasRenderTripList && hasConfirmCreateTrip && hasGetUserIdCall,
        !hasRenderTripList ? '缺少 renderTripList' : !hasConfirmCreateTrip ? '缺少 confirmCreateTrip' : !hasGetUserIdCall ? '未使用 getUserId' : '');
}

function test10_checkSessionValidation() {
    const indexPath = path.join(__dirname, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');

    const hasGetSession = content.includes('supabase.auth.getSession()');
    const hasCheckAuth = content.includes('async function checkAuth()');

    addResult('会话验证检查', hasGetSession && hasCheckAuth,
        !hasCheckAuth ? '缺少 checkAuth 函数' : !hasGetSession ? '缺少 getSession 调用' : '');
}

// ==================== 执行测试 ====================

function runAllTests() {
    console.log('\n========================================');
    console.log('   轻游迹 TripLite - 回归测试');
    console.log('========================================\n');

    test1_checkFileSync();
    test2_checkSupabaseConfig();
    test3_checkAuthFunctions();
    test4_checkLoginErrorHandling();
    test5_checkRegisterFlow();
    test6_checkSQLScript();
    test7_checkBackgroundImage();
    test8_checkLanguageSupport();
    test9_checkTripManagement();
    test10_checkSessionValidation();

    console.log('\n========================================');
    console.log(`   测试结果：${results.passed} 通过，${results.failed} 失败，${results.warnings} 警告`);
    console.log('========================================\n');

    // 输出测试结果到文件
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    log(`测试报告已保存到：${reportPath}`);

    // 如果有失败的测试，退出码为 1
    if (results.failed > 0) {
        console.log('\n❌ 回归测试失败，请修复以下问题：\n');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.log(`  - ${t.name}: ${t.message}`);
        });
        console.log('\n');
        process.exit(1);
    } else {
        console.log('\n✅ 所有测试通过，可以安全发布！\n');
        process.exit(0);
    }
}

runAllTests();
