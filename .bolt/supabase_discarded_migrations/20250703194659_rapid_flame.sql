/*
  # Integrate RLS policies with employee metadata from Supabase Auth

  1. Policy Updates for employees table
    - Drop existing manager policy
    - Create new policy that checks employee metadata from JWT

  2. Policy Updates for sales table  
    - Drop existing employee policies
    - Create new policies that check employee metadata from JWT

  3. Policy Updates for inventory_items table
    - Drop existing policies
    - Create new policies that check employee metadata from JWT

  4. Security
    - All policies now use auth.jwt() to access user metadata
    - Metadata contains employee_db_id, employee_text_id, and employee_role
    - Maintains same security levels but works with anonymous auth + metadata
*/

-- Update employees table policies
DROP POLICY IF EXISTS "Managers can manage employees" ON employees;

CREATE POLICY "Managers can manage employees via metadata"
  ON employees
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (auth.jwt() ->> 'user_metadata' ->> 'employee_role') IN ('manager', 'admin')
  );

-- Update sales table policies
DROP POLICY IF EXISTS "Employees can insert their own sales" ON sales;
DROP POLICY IF EXISTS "Employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales with employee data" ON sales;
DROP POLICY IF EXISTS "Authenticated employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Managers can view all sales" ON sales;

CREATE POLICY "Employees can insert their own sales via metadata"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    employee_id = (auth.jwt() ->> 'user_metadata' ->> 'employee_text_id')
  );

CREATE POLICY "Employees can view their own sales via metadata"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    employee_id = (auth.jwt() ->> 'user_metadata' ->> 'employee_text_id')
  );

CREATE POLICY "Managers can view all sales via metadata"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (auth.jwt() ->> 'user_metadata' ->> 'employee_role') IN ('manager', 'admin')
  );

-- Update inventory_items table policies
DROP POLICY IF EXISTS "Managers can manage inventory" ON inventory_items;
DROP POLICY IF EXISTS "Authenticated users can read inventory" ON inventory_items;

CREATE POLICY "Managers can manage inventory via metadata"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (auth.jwt() ->> 'user_metadata' ->> 'employee_role') IN ('manager', 'admin')
  );

CREATE POLICY "Authenticated employees can read inventory via metadata"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (auth.jwt() ->> 'user_metadata' ->> 'employee_text_id') IS NOT NULL
  );