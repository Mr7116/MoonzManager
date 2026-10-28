-- ============================================================
-- Moonz Guild Manager - Modular Tables Migration Script
-- รันสคริปต์นี้ใน Supabase Dashboard -> เมนู SQL Editor -> New query -> Run
-- ============================================================

-- 1. Create 7 Modular Tables (แยก 7 ตารางตามหน้าการใช้งาน)

-- Table 1: guild_settings (ตั้งค่ากิลด์, รหัสผ่าน PIN, วันที่ไฟล์)
CREATE TABLE IF NOT EXISTS public.guild_settings (
    id INT PRIMARY KEY DEFAULT 1,
    guild_name TEXT DEFAULT 'Moonz',
    pin TEXT DEFAULT 'Moonz',
    file_timestamp TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: guild_members (รายชื่อสมาชิกในกิลด์)
CREATE TABLE IF NOT EXISTS public.guild_members (
    id INT PRIMARY KEY DEFAULT 1,
    members JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: guild_gvg (ผังทัพหลัก GVG)
CREATE TABLE IF NOT EXISTS public.guild_gvg (
    id INT PRIMARY KEY DEFAULT 1,
    teams JSONB DEFAULT '[]'::jsonb,
    parties JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 4: guild_siege (ผังศึกชิงปราสาท Siege)
CREATE TABLE IF NOT EXISTS public.guild_siege (
    id INT PRIMARY KEY DEFAULT 1,
    teams JSONB DEFAULT '[]'::jsonb,
    parties JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: guild_polarity (ผังสงคราวดาว Polarity และตี้จำลอง)
CREATE TABLE IF NOT EXISTS public.guild_polarity (
    id INT PRIMARY KEY DEFAULT 1,
    teams JSONB DEFAULT '[]'::jsonb,
    parties JSONB DEFAULT '[]'::jsonb,
    preset_parties JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: guild_auctions (รอบประมูล และรายการไอเทมประมูล)
CREATE TABLE IF NOT EXISTS public.guild_auctions (
    id INT PRIMARY KEY DEFAULT 1,
    items JSONB DEFAULT '[]'::jsonb,
    rounds JSONB DEFAULT '[]'::jsonb,
    active_round_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 7: guild_queues (ระบบจัดการคิวลงดันเจี้ยน มายาสิ้นสูญ / Apocalypse)
CREATE TABLE IF NOT EXISTS public.guild_queues (
    id INT PRIMARY KEY DEFAULT 1,
    lists JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. เปิดใช้งาน Row Level Security (RLS) ทั้งหมด
ALTER TABLE public.guild_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_gvg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_siege ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_polarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_queues ENABLE ROW LEVEL SECURITY;

-- 3. สร้าง Policies ให้สามารถอ่าน-เขียนข้อมูลได้ผ่าน Anon Key
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow all access to guild_settings" ON public.guild_settings;
    CREATE POLICY "Allow all access to guild_settings" ON public.guild_settings FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_members" ON public.guild_members;
    CREATE POLICY "Allow all access to guild_members" ON public.guild_members FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_gvg" ON public.guild_gvg;
    CREATE POLICY "Allow all access to guild_gvg" ON public.guild_gvg FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_siege" ON public.guild_siege;
    CREATE POLICY "Allow all access to guild_siege" ON public.guild_siege FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_polarity" ON public.guild_polarity;
    CREATE POLICY "Allow all access to guild_polarity" ON public.guild_polarity FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_auctions" ON public.guild_auctions;
    CREATE POLICY "Allow all access to guild_auctions" ON public.guild_auctions FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all access to guild_queues" ON public.guild_queues;
    CREATE POLICY "Allow all access to guild_queues" ON public.guild_queues FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 4. เปิด Realtime สำหรับตารางใหม่ทั้งหมด
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_gvg;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_siege;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_polarity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guild_queues;

-- 5. Auto-Migrate: โคลนข้อมูลเดิมจาก guild_state เข้าตารางใหม่ทันที (ถ้ามีข้อมูลเดิมอยู่)
DO $$
DECLARE
    old_state RECORD;
    extracted_pin TEXT := 'Moonz';
    p_elem JSONB;
    gvg_list JSONB := '[]'::jsonb;
    siege_list JSONB := '[]'::jsonb;
    polarity_list JSONB := '[]'::jsonb;
    preset_list JSONB := '[]'::jsonb;
    siege_teams_list JSONB := '[]'::jsonb;
    polarity_teams_list JSONB := '[]'::jsonb;
    auction_items_list JSONB := '[]'::jsonb;
    auction_rounds_list JSONB := '[]'::jsonb;
    queue_lists_list JSONB := '[]'::jsonb;
BEGIN
    SELECT * INTO old_state FROM public.guild_state WHERE id = 1;
    IF FOUND THEN
        IF old_state.parties IS NOT NULL AND jsonb_typeof(to_jsonb(old_state.parties)) = 'array' THEN
            FOR p_elem IN SELECT * FROM jsonb_array_elements(to_jsonb(old_state.parties))
            LOOP
                IF p_elem->>'id' = '__guild_auth_config__' THEN
                    extracted_pin := COALESCE(p_elem->>'pin', 'Moonz');
                ELSIF p_elem->>'id' = '__siege_teams_config__' THEN
                    siege_teams_list := COALESCE(p_elem->'teams', '[]'::jsonb);
                ELSIF p_elem->>'id' = '__polarity_teams_config__' THEN
                    polarity_teams_list := COALESCE(p_elem->'teams', '[]'::jsonb);
                ELSIF p_elem->>'id' = '__auction_items_config__' THEN
                    auction_items_list := COALESCE(p_elem->'items', '[]'::jsonb);
                    auction_rounds_list := COALESCE(p_elem->'rounds', '[]'::jsonb);
                ELSIF p_elem->>'id' = '__queue_lists_config__' THEN
                    queue_lists_list := COALESCE(p_elem->'lists', '[]'::jsonb);
                ELSIF p_elem->>'category' = 'siege' THEN
                    siege_list := siege_list || jsonb_build_array(p_elem);
                ELSIF p_elem->>'category' = 'polarity' THEN
                    polarity_list := polarity_list || jsonb_build_array(p_elem);
                ELSIF p_elem->>'category' = 'preset' THEN
                    preset_list := preset_list || jsonb_build_array(p_elem);
                ELSE
                    gvg_list := gvg_list || jsonb_build_array(p_elem);
                END IF;
            END LOOP;
        END IF;

        INSERT INTO public.guild_settings (id, guild_name, pin, file_timestamp, updated_at)
        VALUES (1, COALESCE(old_state.guild_name, 'Moonz'), extracted_pin, old_state.file_timestamp, NOW())
        ON CONFLICT (id) DO UPDATE SET
            guild_name = EXCLUDED.guild_name,
            pin = EXCLUDED.pin,
            file_timestamp = EXCLUDED.file_timestamp,
            updated_at = NOW();

        INSERT INTO public.guild_members (id, members, updated_at)
        VALUES (1, COALESCE(to_jsonb(old_state.members), '[]'::jsonb), NOW())
        ON CONFLICT (id) DO UPDATE SET
            members = EXCLUDED.members,
            updated_at = NOW();

        INSERT INTO public.guild_gvg (id, teams, parties, updated_at)
        VALUES (1, '[{"id":"main","name":"ทัพหลัก (Main)","field":"main","color":"rose"},{"id":"sub","name":"ทัพรอง (Sub)","field":"sub","color":"blue"}]'::jsonb, gvg_list, NOW())
        ON CONFLICT (id) DO UPDATE SET
            parties = EXCLUDED.parties,
            updated_at = NOW();

        INSERT INTO public.guild_siege (id, teams, parties, updated_at)
        VALUES (1, siege_teams_list, siege_list, NOW())
        ON CONFLICT (id) DO UPDATE SET
            teams = EXCLUDED.teams,
            parties = EXCLUDED.parties,
            updated_at = NOW();

        INSERT INTO public.guild_polarity (id, teams, parties, preset_parties, updated_at)
        VALUES (1, polarity_teams_list, polarity_list, preset_list, NOW())
        ON CONFLICT (id) DO UPDATE SET
            teams = EXCLUDED.teams,
            parties = EXCLUDED.parties,
            preset_parties = EXCLUDED.preset_parties,
            updated_at = NOW();

        INSERT INTO public.guild_auctions (id, items, rounds, updated_at)
        VALUES (1, auction_items_list, auction_rounds_list, NOW())
        ON CONFLICT (id) DO UPDATE SET
            items = EXCLUDED.items,
            rounds = EXCLUDED.rounds,
            updated_at = NOW();

        INSERT INTO public.guild_queues (id, lists, updated_at)
        VALUES (1, queue_lists_list, NOW())
        ON CONFLICT (id) DO UPDATE SET
            lists = EXCLUDED.lists,
            updated_at = NOW();
    END IF;
END $$;
