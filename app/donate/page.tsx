import Image from 'next/image';

export default function DonatePage() {
  return (
    <div className="card max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">打赏支持</h1>
      
      <p className="text-center text-lg mb-12 text-secondary">
        如果您喜欢我的文章或者我的文章对您有帮助，欢迎打赏并支持我！
      </p>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-64 h-64 border-2 border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Image 
              src="/images/wechat-pay.jpg" 
              alt="微信收款码" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg text-[#09BB07]">微信支付</span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-64 h-64 border-2 border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <Image 
              src="/images/alipay.jpg" 
              alt="支付宝收款码" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg text-[#1677FF]">支付宝</span>
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-secondary">
        <p>您的支持是我持续创作的最大动力。</p>
      </div>
    </div>
  );
}
