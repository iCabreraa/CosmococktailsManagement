-- Crear tabla clients para almacenar información de clientes (registrados y guest)
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  address JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_is_guest ON clients(is_guest);

-- RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy para que los usuarios puedan ver sus propios datos
DROP POLICY IF EXISTS clients_select_own ON clients;
CREATE POLICY clients_select_own ON clients
  FOR SELECT USING (auth.uid() = user_id OR is_guest = true);
  
-- Policy para insertar datos de clientes
DROP POLICY IF EXISTS clients_insert ON clients;
CREATE POLICY clients_insert ON clients
  FOR INSERT WITH CHECK (true);
  
-- Policy para actualizar datos de clientes
DROP POLICY IF EXISTS clients_update ON clients;
CREATE POLICY clients_update ON clients
  FOR UPDATE USING (auth.uid() = user_id OR is_guest = true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
