/*
  # Create sales table for tracking transactions

  1. New Tables
    - `sales`
      - `id` (uuid, primary key)
      - `employee_id` (text, foreign key to employees.employee_id)
      - `order_data` (jsonb) - Complete order information
      - `total_amount` (decimal) - Total sale amount
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `sales` table
    - Add policy for employees to insert their own sales
    - Add policy for managers to view all sales

  3. Indexes
    - Index on employee_id for performance
    - Index on created_at for date-based queries
*/

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL,
  order_data jsonb NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign key constraint
  CONSTRAINT fk_sales_employee 
    FOREIGN KEY (employee_id) 
    REFERENCES employees(employee_id)
    ON DELETE RESTRICT
);

-- Enable Row Level Security
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policy for employees to insert their own sales
CREATE POLICY "Employees can insert their own sales"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    employee_id IN (
      SELECT e.employee_id FROM employees e 
      WHERE e.id = auth.uid() AND e.is_active = true
    )
  );

-- Create policy for employees to view their own sales
CREATE POLICY "Employees can view their own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    employee_id IN (
      SELECT e.employee_id FROM employees e 
      WHERE e.id = auth.uid() AND e.is_active = true
    )
  );

-- Create policy for managers to view all sales
CREATE POLICY "Managers can view all sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
      AND is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_employee_id ON sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_total_amount ON sales(total_amount);