-- Fix blog_comments RLS to allow anonymous comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON blog_comments;

-- Allow anyone (authenticated or not) to create comments
CREATE POLICY "Anyone can create comments"
ON blog_comments
FOR INSERT
WITH CHECK (true);

-- Update default for approved to true (auto-approve)
ALTER TABLE blog_comments ALTER COLUMN approved SET DEFAULT true;