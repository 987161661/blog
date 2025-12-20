-- 1. 创建 'images' 存储桶 (如果不存在)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- 2. 启用 RLS (虽然 storage 通常默认开启，但确保一下)
-- 注意: storage.objects 是 Supabase 内部表，通常不需要手动 alter table enable row level security

-- 3. 设置访问策略 (Policies)

-- 策略: 允许任何人查看图片 (Public Read)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- 策略: 允许经过身份验证的用户上传图片 (Authenticated Upload)
create policy "Authenticated Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'images' );

-- 策略: 允许经过身份验证的用户修改/删除图片 (Authenticated Update/Delete)
create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'images' );

create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'images' );
