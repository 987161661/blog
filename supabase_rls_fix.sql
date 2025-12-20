-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon and authenticated) to read comments
-- This is crucial for comment counts to show up on the home page (PostCard)
CREATE POLICY "Public comments are viewable by everyone" 
ON comments FOR SELECT 
TO public 
USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Authenticated users can insert comments" 
ON comments FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Optional: Allow users to delete their own comments
-- CREATE POLICY "Users can delete their own comments" 
-- ON comments FOR DELETE 
-- TO authenticated 
-- USING (auth.uid() = user_id);
