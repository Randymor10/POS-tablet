/*
  # Create employees table for POS system

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `employee_id` (text, unique) - Human readable employee ID
      - `name` (text) - Employee full name
      - `passcode` (text) - Employee login passcode
      - `role` (text) - Employee role (cashier, manager, admin)
      - `created_at` (timestamp)
      - `is_active` (boolean) - Whether employee can login

  2. Security
    - Enable RLS on `employees` table
    - Add policy for authenticated users to read employee data
    - Add policy for managers/admins to manage employees

  3. Sample Data
    - Insert demo employees for testing
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE NOT NULL,
  name text NOT NULL,
  passcode text NOT NULL,
  role text NOT NULL DEFAULT 'cashier',
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy for reading employee data (for login)
CREATE POLICY "Allow reading employee data for login"
  ON employees
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policy for managers to manage employees
CREATE POLICY "Managers can manage employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
      AND is_active = true
    )
  );

-- Insert sample employees for testing
INSERT INTO employees (employee_id, name, passcode, role, is_active) VALUES
  ('EMP001', 'John Manager', '1234', 'manager', true),
  ('EMP002', 'Jane Cashier', '5678', 'cashier', true),
  ('EMP003', 'Mike Admin', '9999', 'admin', true),
  ('CASH01', 'Sarah Johnson', '1111', 'cashier', true),
  ('CASH02', 'David Wilson', '2222', 'cashier', true)
ON CONFLICT (employee_id) DO NOTHING;