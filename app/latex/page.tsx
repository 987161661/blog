import Link from 'next/link';

export default function LaTeX() {
  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-6 border-b border-border pb-4">LaTeX 公式指南</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-lg mb-4">
          本站支持 LaTeX 数学公式渲染。您可以在文章中使用 LaTeX 语法来编写数学公式。
        </p>

        <div className="bg-accent/30 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">常用公式示例</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-primary mb-2">行内公式</h3>
              <code className="bg-black/30 px-2 py-1 rounded text-sm block mb-2">$E = mc^2$</code>
              <p className="text-secondary">效果：E = mc²</p>
            </div>
            
            <div>
              <h3 className="font-bold text-primary mb-2">块级公式</h3>
              <code className="bg-black/30 px-2 py-1 rounded text-sm block mb-2">$$ \sum_{i=1}^n i = \frac{n(n+1)}{2} $$</code>
              <p className="text-secondary">效果：(求和公式展示)</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">更多资源</h2>
        <ul className="list-disc list-inside space-y-2 text-secondary">
          <li>
            <a href="https://www.latex-project.org/" target="_blank" className="text-primary hover:underline">
              LaTeX 官方网站
            </a>
          </li>
          <li>
            <a href="https://www.overleaf.com/learn/latex/Mathematical_expressions" target="_blank" className="text-primary hover:underline">
              Overleaf 数学公式教程
            </a>
          </li>
          <li>
            <a href="https://latex.codecogs.com/" target="_blank" className="text-primary hover:underline">
              在线 LaTeX 编辑器
            </a>
          </li>
        </ul>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="btn-primary inline-block">
          返回首页
        </Link>
      </div>
    </div>
  );
}
