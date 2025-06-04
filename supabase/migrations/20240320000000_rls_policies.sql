-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view their own categories"
  ON categories
  FOR SELECT
  USING (
    auth.uid() = user_id OR is_default = true
  );

CREATE POLICY "Users can create their own categories"
  ON categories
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  USING (
    auth.uid() = user_id AND is_default = false
  );

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  USING (
    auth.uid() = user_id AND is_default = false
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