-- ============================================================
-- FÉNIX FINANZAS — Schema + Seed Data
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- 1. SUSCRIPCIONES (herramientas / apps SaaS)
-- ============================================================
CREATE TABLE IF NOT EXISTS suscripciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'OPERACIONES',
  frecuencia TEXT NOT NULL DEFAULT 'MENSUAL',
  costo_mensual DECIMAL(10,2) NOT NULL DEFAULT 0,
  moneda TEXT NOT NULL DEFAULT 'USD',
  fecha_pago TEXT,
  tarjeta TEXT,
  proximo_pago TEXT,
  responsable TEXT,
  estado TEXT NOT NULL DEFAULT 'ACTIVO',
  uso TEXT NOT NULL DEFAULT 'MEDIO',
  necesidad TEXT NOT NULL DEFAULT 'NECESARIO',
  notas TEXT,
  correo_asociado TEXT,
  metodo_pago TEXT DEFAULT 'TARJETA',
  meses_activo INTEGER DEFAULT 0,
  costo_acumulado DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_suscripciones" ON suscripciones FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 2. CAMPAÑAS DE MARKETING
-- ============================================================
CREATE TABLE IF NOT EXISTS campanas_marketing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'ADS',
  proyecto TEXT DEFAULT 'FENIX ACADEMY',
  fecha_inicio TEXT,
  fecha_fin TEXT,
  costo_mensual DECIMAL(10,2) DEFAULT 0,
  total_invertido DECIMAL(10,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  ventas INTEGER DEFAULT 0,
  ingresos DECIMAL(10,2) DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'ACTIVA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE campanas_marketing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_campanas" ON campanas_marketing FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 3. INTEGRANTES (equipo / nóminas)
-- ============================================================
CREATE TABLE IF NOT EXISTS integrantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL,
  salario_mensual DECIMAL(10,2) NOT NULL DEFAULT 0,
  fecha_inicio TEXT,
  activo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE integrantes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_integrantes" ON integrantes FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 4. PAGOS DE NÓMINA (historial: salarios + bonos)
-- ============================================================
CREATE TABLE IF NOT EXISTS pagos_nomina (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  integrante_id UUID REFERENCES integrantes(id) ON DELETE CASCADE,
  integrante_nombre TEXT NOT NULL,
  mes TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'SALARIO',
  monto DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  fecha_pago TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pagos_nomina ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_pagos" ON pagos_nomina FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 5. GASTOS PERSONALES
-- ============================================================
CREATE TABLE IF NOT EXISTS gastos_personales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'OTRO',
  descripcion TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'USD',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gastos_personales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_gastos_personales" ON gastos_personales FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- SEED: Suscripciones (datos reales del spreadsheet)
-- ============================================================
INSERT INTO suscripciones (nombre, categoria, frecuencia, costo_mensual, moneda, fecha_pago, tarjeta, proximo_pago, responsable, estado, uso, necesidad, notas, correo_asociado, metodo_pago, meses_activo, costo_acumulado) VALUES
('ELEVENLABS',  'IA',            'MENSUAL',       22.00,  'USD', 'Cada 1ro',       '6170', '31/05/2025', 'CESAR',   'ACTIVO',    'MEDIO', 'NECESARIO',        NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA', 10, 220.00),
('HEYGEN',      'MARKETING',     'MENSUAL',       29.00,  'USD', 'Cada 15',        '6170', '07/07/2025', 'CESAR',   'ACTIVO',    'MEDIO', 'NECESARIO',        NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA',  9, 261.00),
('CAPTIONS',    'MARKETING',     'MENSUAL',       24.99,  'USD', 'Cada 27',        '6170', '27/01/2026', 'CESAR',   'ACTIVO',    'BAJO',  'PRESCINDIBLE',     NULL,                          'equipo@academyfenix.com',          'TARJETA',  2,  49.98),
('OPENPHONE',   'COMUNICACION',  'MENSUAL',       20.50,  'USD', 'Cada 17',        '6170', '21/05/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA', 10, 205.00),
('KOMMO',       'VENTAS',        'CADA 6 MESES',  75.00,  'USD', 'Julio 08',       '4191', '07/01/2026', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'equipo@academyfenix.com',          'TARJETA',  3, 225.00),
('2CLICKS',     'MARKETING',     'MENSUAL',       26.99,  'USD', 'Cada 14',        '6170', '30/11/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA',  4, 107.96),
('LOVABLE',     'IA',            'MENSUAL',       25.00,  'USD', 'Cada 20',        '6170', '20/10/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'equipo@academyfenix.com',          'TARJETA',  5, 125.00),
('ZOOM',        'COMUNICACION',  'MENSUAL',      139.97,  'USD', 'Cada 14',        '6170', '14/12/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'eduardo.escobar@academyfenix.com', 'TARJETA',  4, 559.88),
('SKOOL',       'OPERACIONES',   'MENSUAL',        9.00,  'USD', 'Cada 26',        '6170', '26/02/2026', 'EDUARDO', 'ACTIVO',    'BAJO',  'PRESCINDIBLE',     NULL,                          'equipo@academyfenix.com',          'TARJETA',  1,   9.00),
('VIMEO',       'MARKETING',     'ANUAL',         25.00,  'USD', '2 de Junio',     '6170', '02/06/2025', 'CESAR',   'ACTIVO',    'ALTO',  'NECESARIO',        NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA', 10, 300.00),
('GAMMA',       'DISEÑO',        'ANUAL',         17.92,  'USD', '10 de Marzo',    '6170', '10/03/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'equipo@academyfenix.com',          'TARJETA', 13, 215.00),
('SIGNNOW',     'OPERACIONES',   'ANUAL',         15.00,  'USD', '23 de Marzo',    '6170', '23/03/2026', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA',  0, 180.00),
('HOSTINGUER',  'OPERACIONES',   'ANUAL',          8.93,  'USD', '16 de Mayo',     '4191', '16/05/2025', 'CESAR',   'ACTIVO',    'ALTO',  'SOPORTE OPERATIVO',NULL,                          'cesar.escobar@academyfenix.com',   'TARJETA', 10, 107.16),
('EASYPANEL',   'OPERACIONES',   'MENSUAL',       24.49,  'USD', 'Cada 21',        '4191', '21/02/2026', 'CESAR',   'ACTIVO',    'ALTO',  'NECESARIO',        'N8N y Chatwoot',              'cesar.escobar@academyfenix.com',   'TARJETA',  1,  24.49),
('CLAUDE',      'IA',            'MENSUAL',       20.00,  'USD', 'Cada 2',         '5416', '02/03/2026', 'EDUARDO', 'CANCELADO', 'ALTO',  'EN EVALUACION',    'Cancelado esperando decision', 'equipo@academyfenix.com',          'TARJETA',  1,  20.00),
('STREAMYARD',  'COMUNICACION',  'ONE-TIME',      89.00,  'USD', 'Cada 1ro',       '4191', '01/03/2026', 'CESAR',   'CANCELADO', 'BAJO',  'INECESARIO',       'Cancelado',                   'cesar.escobar@academyfenix.com',   'TARJETA',  1,  89.00),
('ENVATO',      'DISEÑO',        'MENSUAL',       41.34,  'USD', 'Cada 4',         '4191', '04/10/2025', 'CESAR',   'CANCELADO', 'BAJO',  'INECESARIO',       'Cancelado',                   'equipo@academyfenix.com',          'TARJETA',  6, 248.04);

-- ============================================================
-- SEED: Campañas de marketing
-- ============================================================
INSERT INTO campanas_marketing (nombre, tipo, proyecto, fecha_inicio, fecha_fin, costo_mensual, total_invertido, leads, ventas, ingresos, estado) VALUES
('TWILIO', 'LLAMADAS', 'FENIX ACADEMY', '01/04/2026', NULL, 20.00, 20.00, 0, 0, 0, 'ACTIVA');

-- ============================================================
-- SEED: Integrantes (equipo)
-- ============================================================
INSERT INTO integrantes (nombre, rol, salario_mensual, fecha_inicio, activo) VALUES
('JUNIOR',  'OPERACIONES',   700.00, NULL,         false),
('AGNY',    'COORDINACION',  400.00, NULL,         false),
('EDUARDO', 'OPERACIONES',   500.00, '01/12/2025', true),
('YEIMI',   'VENTAS',        400.00, NULL,         false);

-- ============================================================
-- SEED: Pagos de nómina (historial de Eduardo)
-- ============================================================
INSERT INTO pagos_nomina (integrante_nombre, mes, tipo, monto, fecha_pago)
SELECT 'EDUARDO', mes, 'SALARIO', 500.00, fecha
FROM (VALUES
  ('Diciembre 2025', '01/12/2025'),
  ('Enero 2026',     '01/01/2026'),
  ('Febrero 2026',   '01/02/2026'),
  ('Marzo 2026',     '01/03/2026')
) AS t(mes, fecha);

UPDATE pagos_nomina pn
SET integrante_id = i.id
FROM integrantes i
WHERE i.nombre = 'EDUARDO' AND pn.integrante_nombre = 'EDUARDO';
