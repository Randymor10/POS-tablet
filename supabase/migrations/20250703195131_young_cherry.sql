/*
  # Update RLS policies to work with JWT metadata

  1. Policy Updates
    - Update employees table policies to check JWT metadata for role
    - Update sales table policies to check JWT metadata for employee ID and role
    - Update inventory_items table policies to check JWT metadata for authentication

  2. Security Changes
    - All policies now work with anonymous authentication + JWT metadata
    - Proper JSON casting to avoid operator errors
    - Maintain same security levels with improved authentication flow
*/

-- Update employees table policies
DROP POLICY IF EXISTS "Allow reading employee data for login" ON employees;
DROP POLICY IF EXISTS "Managers can manage employees" ON employees;

-- Allow reading employee data for login (unchanged)
CREATE POLICY "Allow reading employee data for login"
  ON employees
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Managers can manage employees via JWT metadata
CREATE POLICY "Managers can manage employees via metadata"
  ON employees
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'employee_role')::text,
      ''
    ) IN ('manager', 'admin')
  );

-- Update sales table policies
DROP POLICY IF EXISTS "Employees can insert their own sales" ON sales;
DROP POLICY IF EXISTS "Employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales with employee data" ON sales;
DROP POLICY IF EXISTS "Authenticated employees can view their own sales" ON sales;
DROP POLICY IF EXISTS "Managers can view all sales" ON sales;

-- Employees can insert their own sales via JWT metadata
CREATE POLICY "Employees can insert their own sales via metadata"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    employee_id = COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'employee_text_id')::text,
      ''
    )
  );

-- Employees can view their own sales via JWT metadata
CREATE POLICY "Employees can view their own sales via metadata"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    (
      employee_id = COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'employee_text_id')::text,
        ''
      ) OR
      COALESCE(
        (auth.jwt() -> 'user_metadata' ->> 'employee_role')::text,
        ''
      ) IN ('manager', 'admin')
    )
  );

-- Update inventory_items table policies
DROP POLICY IF EXISTS "Managers can manage inventory" ON inventory_items;
DROP POLICY IF EXISTS "Authenticated users can read inventory" ON inventory_items;

-- Managers can manage inventory via JWT metadata
CREATE POLICY "Managers can manage inventory via metadata"
  ON inventory_items
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'employee_role')::text,
      ''
    ) IN ('manager', 'admin')
  );

-- Authenticated employees can read inventory via JWT metadata
CREATE POLICY "Authenticated employees can read inventory via metadata"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'employee_text_id')::text,
      ''
    ) != ''
  );