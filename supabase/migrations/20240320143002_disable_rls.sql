-- Temporarily disable RLS for expenses during development
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

-- Allow all operations on expenses for development
CREATE POLICY "Allow all operations on expenses during development"
  ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true); 