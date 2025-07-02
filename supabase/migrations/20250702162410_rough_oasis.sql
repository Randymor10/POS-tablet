/*
  # Update Sales RLS Policy for Anonymous Authentication

  1. Security Changes
    - Update the existing RLS policy to work with anonymous authentication
    - Allow authenticated users (including anonymous) to insert sales if they have employee metadata
    - Maintain security by checking employee data in user metadata

  2. Policy Updates
    - Modify "Employees can insert their own sales" policy to work with auth.uid()
    - Update policy to check user metadata for employee information
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Employees can insert their own sales" ON sales;

-- Create a new policy that works with authenticated users (including anonymous auth)
CREATE POLICY "Authenticated users can insert sales with employee data"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Check that the user is authenticated and has employee metadata
    auth.uid() IS NOT NULL AND
    -- Verify the employee_id in the insert matches the employee_code in user metadata
    employee_id = (auth.jwt() ->> 'user_metadata' ->> 'employee_code')
  );

-- Update the select policy to also work with authenticated users
DROP POLICY IF EXISTS "Employees can view their own sales" ON sales;

CREATE POLICY "Authenticated employees can view their own sales"
  ON sales
  FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is authenticated and viewing their own sales
    auth.uid() IS NOT NULL AND
    employee_id = (auth.jwt() ->> 'user_metadata' ->> 'employee_code')
  );