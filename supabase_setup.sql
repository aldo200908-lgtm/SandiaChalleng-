
-- 1. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES
-- Esta tabla guarda el saldo real y puntos del usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  name TEXT,
  avatar TEXT,
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  wallet_balance DECIMAL(16,4) DEFAULT 0.0000, -- 4 decimales para precisión total
  streak INTEGER DEFAULT 0,
  phone TEXT,
  yape_number TEXT,
  plin_number TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE HISTORIAL DE RECOMPENSAS
-- Aquí se registran las encuestas de CPX Research
CREATE TABLE IF NOT EXISTS reward_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_amount DECIMAL(16,4) NOT NULL, -- Guardamos el monto exacto con 4 decimales
  provider TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FUNCIÓN PARA SUMAR EL SALDO AUTOMÁTICAMENTE
-- Cada vez que se inserta una fila en reward_history, esta función suma al perfil
CREATE OR REPLACE FUNCTION update_user_balance_on_reward() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET wallet_balance = COALESCE(wallet_balance, 0) + NEW.reward_amount
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. TRIGGER (EL DISPARADOR)
-- Activamos la función anterior automáticamente después de cada inserción
DROP TRIGGER IF EXISTS on_reward_added ON reward_history;
CREATE TRIGGER on_reward_added
  AFTER INSERT ON reward_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance_on_reward();

-- 6. SEGURIDAD (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_history ENABLE ROW LEVEL SECURITY;

-- Políticas para que los usuarios vean solo sus propios datos
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own rewards') THEN
        CREATE POLICY "Users can view own rewards" ON reward_history FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;
