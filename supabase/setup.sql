-- Tabla de suscriptores del Oráculo
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS subscribers (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id     text UNIQUE NOT NULL,
  stripe_subscription_id text,
  email                  text,
  nombre                 text,
  fecha_nacimiento       text,
  genero                 text,
  signo                  text,
  status                 text NOT NULL DEFAULT 'active',
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS subscribers_status_idx ON subscribers(status);
CREATE INDEX IF NOT EXISTS subscribers_email_idx  ON subscribers(email);

-- Deshabilitar acceso público (solo service role puede leer/escribir)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
