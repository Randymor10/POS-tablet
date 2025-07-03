/*
  # Create inventory_items table

  1. New Tables
    - `inventory_items`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `category` (text, required)
      - `current_stock` (integer, required)
      - `min_stock` (integer, required)
      - `unit` (text, required)
      - `cost_per_unit` (numeric, optional)
      - `supplier` (text, optional)
      - `last_restocked` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `inventory_items` table
    - Add policy for managers/admins to manage inventory
    - Add policy for all authenticated users to read inventory

  3. Indexes
    - Add index on category for faster filtering
    - Add index on current_stock for low stock queries
*/

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  current_stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL,
  cost_per_unit numeric(10,2),
  supplier text,
  last_restocked timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Policy for managers and admins to manage inventory
CREATE POLICY "Managers can manage inventory"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = auth.uid()
      AND employees.role IN ('manager', 'admin')
      AND employees.is_active = true
    )
  );

-- Policy for all authenticated users to read inventory
CREATE POLICY "Authenticated users can read inventory"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees
      WHERE employees.id = auth.uid()
      AND employees.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_stock ON inventory_items(current_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_min_stock ON inventory_items(min_stock);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();