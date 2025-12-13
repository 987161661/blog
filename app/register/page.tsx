import Link from 'next/link';

export default function Register() {
  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">会员注册</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">用户名</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="梓安"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">密码</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="******"
          />
        </div>
        <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          注册
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        已有账号？ <Link href="/login" className="text-primary hover:underline">立即登录</Link>
      </div>
    </div>
  );
}
