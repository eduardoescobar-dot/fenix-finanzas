-- ============================================================
-- FÉNIX FINANZAS — Migration 002: Ingresos + Vuelos + Datos Históricos
-- Auditoría Fiscal 2024–2025 — César Escobar Hernández
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- ============================================================
-- 1. TABLA INGRESOS
-- ============================================================
CREATE TABLE IF NOT EXISTS ingresos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha TEXT NOT NULL,
  año INTEGER NOT NULL,
  fuente TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'USD',
  tipo TEXT NOT NULL DEFAULT 'COMISION',
  estado TEXT NOT NULL DEFAULT 'CONFIRMADO',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ingresos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_ingresos" ON ingresos FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- 2. TABLA VUELOS
-- ============================================================
CREATE TABLE IF NOT EXISTS vuelos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha TEXT NOT NULL,
  año INTEGER NOT NULL,
  aerolinea TEXT NOT NULL,
  confirmacion TEXT NOT NULL,
  ruta TEXT,
  monto DECIMAL(10,2) NOT NULL DEFAULT 0,
  moneda TEXT NOT NULL DEFAULT 'USD',
  tipo_viaje TEXT NOT NULL DEFAULT 'MIXTO',
  deducible BOOLEAN DEFAULT true,
  pasajero TEXT DEFAULT 'CESAR ESCOBAR',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vuelos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_vuelos" ON vuelos FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- SEED: Ingresos 2024 — Raul Luna Academy (comisiones echeck)
-- ============================================================
INSERT INTO ingresos (fecha, año, fuente, descripcion, monto, tipo, estado, notas) VALUES
('2024-01-15', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 9116.76, 'COMISION', 'CONFIRMADO', NULL),
('2024-01-26', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 5715.20, 'COMISION', 'CONFIRMADO', NULL),
('2024-02-12', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 6499.15, 'COMISION', 'CONFIRMADO', NULL),
('2024-02-27', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 2899.80, 'COMISION', 'CONFIRMADO', NULL),
('2024-03-20', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 7037.31, 'COMISION', 'PENDIENTE', 'Verificar — posible anulación ese día'),
('2024-03-20', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 3723.32, 'COMISION', 'PENDIENTE', 'Verificar — posible anulación ese día'),
('2024-04-05', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 7725.62, 'COMISION', 'CONFIRMADO', NULL),
('2024-04-19', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 6573.94, 'COMISION', 'CONFIRMADO', NULL),
('2024-05-04', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 855.00,  'COMISION', 'CONFIRMADO', NULL),
('2024-05-17', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 7145.92, 'COMISION', 'CONFIRMADO', NULL),
('2024-06-05', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 3657.10, 'COMISION', 'CONFIRMADO', NULL),
('2024-06-17', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 13177.44,'COMISION', 'CONFIRMADO', NULL),
('2024-06-29', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 5989.50, 'COMISION', 'CONFIRMADO', NULL),
('2024-07-12', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 3557.50, 'COMISION', 'CONFIRMADO', NULL),
('2024-07-26', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 1322.50, 'COMISION', 'CONFIRMADO', NULL),
('2024-08-09', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 1792.50, 'COMISION', 'CONFIRMADO', NULL),
('2024-08-22', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 740.00,  'COMISION', 'CONFIRMADO', NULL),
('2024-09-05', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 8877.00, 'COMISION', 'CONFIRMADO', NULL),
('2024-09-19', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 1503.00, 'COMISION', 'CONFIRMADO', NULL),
('2024-10-02', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 1136.97, 'COMISION', 'CONFIRMADO', NULL),
('2024-10-17', 2024, 'Raul Luna Academy, LLC', 'Comisión echeck', 339.97,  'COMISION', 'CONFIRMADO', NULL);

-- ============================================================
-- SEED: Ingresos 2024 — Zelle Spartans
-- ============================================================
INSERT INTO ingresos (fecha, año, fuente, descripcion, monto, tipo, estado, notas) VALUES
('2024-10-04', 2024, 'CLAUDIA ELIAS',              'Programa Spartans — Zelle', 300.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-06', 2024, 'EDUARDO ESCOBAR HERNANDEZ',  'Programa Spartans — Zelle', 50.00,  'ZELLE', 'CONFIRMADO', NULL),
('2024-10-21', 2024, 'MARIANNA CAMILLA VEGA',      'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-21', 2024, 'BRIAN GUTIERREZ LARA',       'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-21', 2024, 'ELITH SOLARES',              'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-21', 2024, 'BIANCA ARIAS',               'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-22', 2024, 'EDUARDO ESCOBAR HERNANDEZ',  'Programa Spartans — Zelle', 75.00,  'ZELLE', 'CONFIRMADO', NULL),
('2024-10-22', 2024, 'PL BEAUTY ACADEMY LLC',      'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-24', 2024, 'DBR SERVICES LLC',           'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-24', 2024, 'CLEIDY LOPEZ',               'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-25', 2024, 'EXPLORER INVESTORS 180 LLC', 'Programa Spartans — Zelle', 273.00, 'ZELLE', 'CONFIRMADO', NULL),
('2024-10-26', 2024, 'ANTONIO ESCOBAR',            'Programa Spartans — Zelle', 98.00,  'ZELLE', 'CONFIRMADO', NULL);

-- ============================================================
-- SEED: Ingresos 2025 — Stripe Payouts (Fénix Academy, LLC)
-- ============================================================
INSERT INTO ingresos (fecha, año, fuente, descripcion, monto, tipo, estado, notas) VALUES
('2025-04-30', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Abril 2025',      187.78,    'STRIPE', 'CONFIRMADO', NULL),
('2025-05-31', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Mayo 2025',       3469.80,   'STRIPE', 'CONFIRMADO', NULL),
('2025-06-30', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Junio 2025',      8816.18,   'STRIPE', 'CONFIRMADO', NULL),
('2025-07-31', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Julio 2025',      5013.01,   'STRIPE', 'CONFIRMADO', NULL),
('2025-08-31', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Agosto 2025',     2615.75,   'STRIPE', 'CONFIRMADO', NULL),
('2025-09-30', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Septiembre 2025', 12707.20,  'STRIPE', 'CONFIRMADO', NULL),
('2025-10-31', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Octubre 2025',    37106.43,  'STRIPE', 'CONFIRMADO', NULL),
('2025-11-30', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Noviembre 2025',  9740.56,   'STRIPE', 'CONFIRMADO', NULL),
('2025-12-31', 2025, 'Stripe — Fénix Academy, LLC', 'Payout Diciembre 2025',  38593.76,  'STRIPE', 'CONFIRMADO', NULL);

-- ============================================================
-- SEED: Vuelos 2024 — Delta Air Lines
-- ============================================================
INSERT INTO vuelos (fecha, año, aerolinea, confirmacion, ruta, monto, tipo_viaje, deducible, pasajero, notas) VALUES
('2024-03-01', 2024, 'Delta Air Lines', 'HUUNGW', 'ATL → destino', 996.20, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Feb 03 2024'),
('2024-05-24', 2024, 'Delta Air Lines', 'HAYXCY', 'ATL → destino', 553.20, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Abr 25 2024'),
('2024-07-03', 2024, 'Delta Air Lines', 'G5BNH4', 'ATL → destino', 398.48, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Jun 24 2024'),
('2024-07-07', 2024, 'Delta Air Lines', 'G4X7M4', 'ATL → destino', 498.47, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Jun 24 2024'),
('2024-07-07', 2024, 'Delta Air Lines', 'G4X7M4', 'Upgrade/cambio', 100.01,'MIXTO',    true,  'CESAR ESCOBAR',        'Cargo adicional cambio Jul 06'),
('2024-07-07', 2024, 'Delta Air Lines', 'GWOBDA', 'ATL → destino', 598.48, 'PERSONAL', false, 'MARIA REINA HERNANDEZ','Boleto familiar — NO DEDUCIBLE'),
('2024-08-23', 2024, 'Delta Air Lines', 'GEAEI4', 'ATL → destino', 699.96, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Ago 18 2024'),
('2024-09-01', 2024, 'Delta Air Lines', 'GEAEI4', 'Cambio vuelo',   52.98, 'MIXTO',    true,  'CESAR ESCOBAR',        'Cargo adicional cambio Ago 31'),
('2024-09-15', 2024, 'Delta Air Lines', 'GFJF2K', 'Award Trip',     11.20, 'MIXTO',    true,  'CESAR ESCOBAR',        '45,000 SkyMiles + taxes only'),
('2024-11-03', 2024, 'Delta Air Lines', 'HX5U5R', 'ATL → destino', 221.48, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Oct 22 2024'),
('2024-12-04', 2024, 'Delta Air Lines', 'G7ODAH', 'ATL → destino', 373.47, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Nov 12 2024'),
('2024-12-10', 2024, 'Delta Air Lines', 'G7K962', 'SAN → ATL',     143.48, 'MIXTO',    true,  'CESAR ESCOBAR',        'Comprado Nov 12 2024');

-- ============================================================
-- SEED: Vuelos 2025
-- ============================================================
INSERT INTO vuelos (fecha, año, aerolinea, confirmacion, ruta, monto, tipo_viaje, deducible, pasajero, notas) VALUES
('2025-01-20', 2025, 'Delta Air Lines',   'HVGUBJ', 'ATL → SAN + SAN → ATL', 376.95, 'MIXTO',    true,  'CESAR ESCOBAR', 'Viaje redondo. Comprado Dic 10 2024'),
('2025-04-22', 2025, 'Spirit Airlines',   'RM4SNW', 'ATL → LAS',               0.00,  'MIXTO',    true,  'CESAR ESCOBAR', 'Precio N/D — buscar en Expedia/Spirit'),
('2025-04-24', 2025, 'Spirit Airlines',   'ONHDPD', 'LAS/LAX → ATL',         307.74,  'MIXTO',    false, 'CESAR ESCOBAR', 'CANCELADO — verificar reembolso'),
('2025-04-26', 2025, 'Frontier Airlines', 'X8PLGB', 'LAS área',               107.96,  'MIXTO',    true,  'CESAR ESCOBAR', NULL),
('2025-05-06', 2025, 'American Airlines', 'UEJSKB', '→ ATL',                    0.00,  'MIXTO',    true,  'CESAR ESCOBAR', 'Precio N/D — solo email post-vuelo'),
('2025-11-26', 2025, 'Delta Air Lines',   'G9JKVC', 'ATL → SLC → ATL',        973.97,  'MIXTO',    true,  'CESAR ESCOBAR', 'Viaje redondo. Comprado Nov 22 2025');

-- ============================================================
-- SEED: Gastos Personales — Variables e Inspección
-- ============================================================
INSERT INTO gastos_personales (fecha, categoria, descripcion, monto, moneda, notas) VALUES
('2024-12-01', 'OTRO',        'J.P.J. Home Inspections — Invoice #001735', 375.00, 'USD', '368 Waterford Rd NW — deal cancelado Dic 27 2024. Regency Properties LLC'),
('2025-05-16', 'HERRAMIENTA', 'WordPress curso',                              9.99, 'USD', 'Capacitación operativa'),
('2025-06-09', 'HERRAMIENTA', 'Master en Zapier (curso)',                    13.99, 'USD', 'Automatización de procesos'),
('2025-06-09', 'HERRAMIENTA', 'OBS Studio (curso)',                          13.99, 'USD', 'Producción de contenido'),
('2025-07-02', 'OTRO',        'Prospección LinkedIn + ADS',                  27.08, 'USD', 'Marketing prospección'),
('2025-07-07', 'HERRAMIENTA', 'HeyGen — videos IA',                          29.00, 'USD', 'Creación de videos con IA');

-- ============================================================
-- Actualizar integrantes — activar Junior y Agny
-- ============================================================
UPDATE integrantes SET activo = true, fecha_inicio = '01/06/2025' WHERE nombre = 'JUNIOR';
UPDATE integrantes SET activo = true, fecha_inicio = '01/06/2025' WHERE nombre = 'AGNY';

-- Agregar Juan Ciro y Pedro si no existen
INSERT INTO integrantes (nombre, rol, salario_mensual, fecha_inicio, activo)
SELECT 'JUAN CIRO', 'SOPORTE', 200.00, '01/10/2025', false
WHERE NOT EXISTS (SELECT 1 FROM integrantes WHERE nombre = 'JUAN CIRO');

INSERT INTO integrantes (nombre, rol, salario_mensual, fecha_inicio, activo)
SELECT 'PEDRO', 'CONTENIDO', 400.00, '01/11/2025', false
WHERE NOT EXISTS (SELECT 1 FROM integrantes WHERE nombre = 'PEDRO');

-- ============================================================
-- SEED: Pagos nómina — Junior ($700/mes Jun–Dic 2025)
-- ============================================================
INSERT INTO pagos_nomina (integrante_nombre, mes, tipo, monto, fecha_pago) VALUES
('JUNIOR', 'Junio 2025',      'SALARIO', 700.00, '01/06/2025'),
('JUNIOR', 'Julio 2025',      'SALARIO', 700.00, '01/07/2025'),
('JUNIOR', 'Agosto 2025',     'SALARIO', 700.00, '01/08/2025'),
('JUNIOR', 'Septiembre 2025', 'SALARIO', 700.00, '01/09/2025'),
('JUNIOR', 'Octubre 2025',    'SALARIO', 700.00, '01/10/2025'),
('JUNIOR', 'Noviembre 2025',  'SALARIO', 700.00, '01/11/2025'),
('JUNIOR', 'Diciembre 2025',  'SALARIO', 700.00, '01/12/2025');

UPDATE pagos_nomina pn SET integrante_id = i.id
FROM integrantes i
WHERE i.nombre = 'JUNIOR' AND pn.integrante_nombre = 'JUNIOR' AND pn.integrante_id IS NULL;

-- ============================================================
-- SEED: Pagos nómina — Agny ($400/mes Jun–Dic 2025)
-- ============================================================
INSERT INTO pagos_nomina (integrante_nombre, mes, tipo, monto, fecha_pago) VALUES
('AGNY', 'Junio 2025',      'SALARIO', 400.00, '01/06/2025'),
('AGNY', 'Julio 2025',      'SALARIO', 400.00, '01/07/2025'),
('AGNY', 'Agosto 2025',     'SALARIO', 400.00, '01/08/2025'),
('AGNY', 'Septiembre 2025', 'SALARIO', 400.00, '01/09/2025'),
('AGNY', 'Octubre 2025',    'SALARIO', 400.00, '01/10/2025'),
('AGNY', 'Noviembre 2025',  'SALARIO', 400.00, '01/11/2025'),
('AGNY', 'Diciembre 2025',  'SALARIO', 400.00, '01/12/2025');

UPDATE pagos_nomina pn SET integrante_id = i.id
FROM integrantes i
WHERE i.nombre = 'AGNY' AND pn.integrante_nombre = 'AGNY' AND pn.integrante_id IS NULL;

-- ============================================================
-- SEED: Pagos nómina — Juan Ciro (fechas exactas PayPal)
-- ============================================================
INSERT INTO pagos_nomina (integrante_nombre, mes, tipo, monto, fecha_pago, descripcion) VALUES
('JUAN CIRO', 'Octubre 2025',   'SALARIO', 200.00, '17/10/2025', 'PayPal — cuenta corporativa'),
('JUAN CIRO', 'Diciembre 2025', 'SALARIO', 200.00, '13/12/2025', 'PayPal — cuenta corporativa'),
('JUAN CIRO', 'Diciembre 2025', 'SALARIO', 200.00, '30/12/2025', 'PayPal — cuenta corporativa');

UPDATE pagos_nomina pn SET integrante_id = i.id
FROM integrantes i
WHERE i.nombre = 'JUAN CIRO' AND pn.integrante_nombre = 'JUAN CIRO' AND pn.integrante_id IS NULL;

-- ============================================================
-- SEED: Pagos nómina — Pedro (Nov–Dic 2025, contrato 6 semanas)
-- ============================================================
INSERT INTO pagos_nomina (integrante_nombre, mes, tipo, monto, fecha_pago, descripcion) VALUES
('PEDRO', 'Noviembre 2025', 'SALARIO', 400.00, '01/11/2025', 'Contrato 6 semanas — ver Drive'),
('PEDRO', 'Diciembre 2025', 'SALARIO', 400.00, '01/12/2025', 'Contrato 6 semanas — ver Drive');

UPDATE pagos_nomina pn SET integrante_id = i.id
FROM integrantes i
WHERE i.nombre = 'PEDRO' AND pn.integrante_nombre = 'PEDRO' AND pn.integrante_id IS NULL;

-- ============================================================
-- SEED: Campañas marketing — agregar histórico
-- ============================================================
INSERT INTO campanas_marketing (nombre, tipo, proyecto, fecha_inicio, fecha_fin, costo_mensual, total_invertido, leads, ventas, ingresos, estado) VALUES
('Meta Ads 2024',           'ADS',      'RAUL LUNA ACADEMY', '01/01/2024', '31/12/2024', 0, 0, 0, 0, 95662.00, 'COMPLETADA'),
('Meta Ads 2025',           'ADS',      'FENIX ACADEMY',     '01/04/2025', NULL,          0, 0, 0, 0, 118250.47,'ACTIVA'),
('OpenPhone / Quo',         'LLAMADAS', 'FENIX ACADEMY',     '01/09/2025', NULL,         25, 0, 0, 0, 0,         'ACTIVA'),
('Google Workspace Ads',    'ADS',      'FENIX ACADEMY',     '01/06/2025', NULL,         35, 0, 0, 0, 0,         'ACTIVA');
