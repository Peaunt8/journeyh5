-- =========================================
-- 轻游迹 TripLite - Supabase 数据库初始化脚本
-- =========================================

-- 1. 创建出行计划表
CREATE TABLE IF NOT EXISTS trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    destination TEXT DEFAULT '',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建行程数据表（存储每个出行计划的详细数据）
CREATE TABLE IF NOT EXISTS trip_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    checklist JSONB DEFAULT '{}',
    custom_items JSONB DEFAULT '[]',
    day_plans JSONB DEFAULT '[]',
    notes TEXT DEFAULT '',
    destination TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_data_trip_id ON trip_data(trip_id);

-- 4. 设置 Row Level Security (RLS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_data ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略 - 用户只能访问自己的数据
CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (user_id = auth.uid()::TEXT OR user_id = (auth.jwt() ->> 'phone'));

CREATE POLICY "Users can insert own trips" ON trips
    FOR INSERT WITH CHECK (user_id = auth.uid()::TEXT OR user_id = (auth.jwt() ->> 'phone'));

CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (user_id = auth.uid()::TEXT OR user_id = (auth.jwt() ->> 'phone'));

CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (user_id = auth.uid()::TEXT OR user_id = (auth.jwt() ->> 'phone'));

-- trip_data 通过 trip_id 关联，允许已认证用户访问
CREATE POLICY "Users can view trip data" ON trip_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_data.trip_id
            AND (trips.user_id = auth.uid()::TEXT OR trips.user_id = (auth.jwt() ->> 'phone'))
        )
    );

CREATE POLICY "Users can insert trip data" ON trip_data
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_data.trip_id
            AND (trips.user_id = auth.uid()::TEXT OR trips.user_id = (auth.jwt() ->> 'phone'))
        )
    );

CREATE POLICY "Users can update trip data" ON trip_data
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_data.trip_id
            AND (trips.user_id = auth.uid()::TEXT OR trips.user_id = (auth.jwt() ->> 'phone'))
        )
    );

CREATE POLICY "Users can delete trip data" ON trip_data
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_data.trip_id
            AND (trips.user_id = auth.uid()::TEXT OR trips.user_id = (auth.jwt() ->> 'phone'))
        )
    );

-- 6. 创建自动更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_data_updated_at
    BEFORE UPDATE ON trip_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 使用说明：
-- 1. 在 Supabase 控制台创建项目
-- 2. 进入 SQL Editor，粘贴并运行此脚本
-- 3. 在 Authentication -> Providers 中启用 Phone 登录
-- 4. 获取项目 URL 和 Anon Key，替换到 HTML 文件中
-- =========================================
