/*
  # Update RLS policies for metadata-based authentication

  1. Security Updates
    - Update employees table policies for metadata-based role checking
    - Update sales table policies for metadata-based employee identification
    - Update inventory_items table policies for metadata-based access control

  2. Changes
    - Drop existing policies that may conflict
    - Create new policies using JWT metadata for authentication
    - Ensure proper access control based on employee roles and IDs
*/

-- Update employees table policies
DROP POLICY IF EXISTS "Managers can manage employees" ON employees;
DROP POLICY IF EXISTS "Managers can manage employees via metadata" ON employees;

CREATE POLICY "Managers can manage employees via metadata"
  ON employees
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_role'), '') = ANY(ARRAY['manager', 'admin'])
  );

-- Update sales table policies
DROP POLICY IF EXISTS "Employees can insert their own sales" ON sales;
DROP POLICY IF EXISTS "Employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales with employee data" ON sales;
DROP POLICY IF EXISTS "Authenticated employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Managers can view all sales" ON sales;
DROP POLICY IF EXISTS "Employees can insert their own sales via metadata" ON sales;
DROP POLICY IF EXISTS "Employees can view their own sales via metadata" ON sales;

CREATE POLICY "Employees can insert their own sales via metadata"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    employee_id = COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_text_id'), '')
  );

CREATE POLICY "Employees can view their own sales via metadata"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (employee_id = COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_text_id'), '') OR
     COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_role'), '') = ANY(ARRAY['manager', 'admin']))
  );

-- Update inventory_items table policies
DROP POLICY IF EXISTS "Managers can manage inventory" ON inventory_items;
DROP POLICY IF EXISTS "Authenticated users can read inventory" ON inventory_items;
DROP POLICY IF EXISTS "Managers can manage inventory via metadata" ON inventory_items;
DROP POLICY IF EXISTS "Authenticated employees can read inventory via metadata" ON inventory_items;

CREATE POLICY "Managers can manage inventory via metadata"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_role'), '') = ANY(ARRAY['manager', 'admin'])
  );

CREATE POLICY "Authenticated employees can read inventory via metadata"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'employee_text_id'), '') <> ''
  );