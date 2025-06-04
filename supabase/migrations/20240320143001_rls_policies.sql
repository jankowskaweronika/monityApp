-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories can be created by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories can be updated by authenticated users" ON categories;
DROP POLICY IF EXISTS "Categories can be deleted by authenticated users" ON categories;
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Categories policies
-- Categories are public for reading
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

-- Only authenticated users can create categories
CREATE POLICY "Categories can be created by authenticated users"
  ON categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update non-default categories
CREATE POLICY "Categories can be updated by authenticated users"
  ON categories
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND is_default = false
  );

-- Only authenticated users can delete non-default categories
CREATE POLICY "Categories can be deleted by authenticated users"
  ON categories
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND is_default = false
  );

-- Expenses policies
CREATE POLICY "Users can view their own expenses"
  ON expenses
  FOR SELECT
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can create their own expenses"
  ON expenses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own expenses"
  ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can delete their own expenses"
  ON expenses
  FOR DELETE
  USING (
    auth.uid() = user_id
  ); 