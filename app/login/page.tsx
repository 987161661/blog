import Link from 'next/link';

export default function Login() {
  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">会员登录</h1>
      <form className="space-y-4">
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
          登录
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        还没有账号？ <Link href="/register" className="text-primary hover:underline">立即注册</Link>
      </div>
    </div>
  );
}
