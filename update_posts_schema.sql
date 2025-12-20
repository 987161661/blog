-- Add 'status' column to 'posts' table if it doesn't exist
alter table posts 
add column if not exists status text default 'published';

-- Optional: Add a check constraint to ensure valid status values
alter table posts 
drop constraint if exists posts_status_check;

alter table posts 
add constraint posts_status_check 
check (status in ('published', 'draft', 'scheduled'));

-- Update existing posts to have 'published' status if currently null
update posts 
set status = 'published' 
where status is null;

-- Ensure RLS policies allow reading 'published' posts and 'scheduled' posts only if time is reached?
-- For now, let's keep it simple. The current RLS likely allows reading everything or based on public logic.
-- If you want to hide drafts from public API, you should update RLS.

-- Example RLS update (Uncomment and run if you want to enforce public visibility rules at DB level):
-- drop policy if exists "Public can view posts" on posts;
-- create policy "Public can view published posts"
-- on posts for select
-- using ( status = 'published' );

-- For the admin/author, they should be able to see everything.
-- create policy "Authors can view all their posts"
-- on posts for select
-- using ( auth.uid() = author_id );
