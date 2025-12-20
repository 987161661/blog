export default function About() {
  return (
    <div className="card">
      <h1 className="text-3xl font-bold mb-6">关于我</h1>
      <div className="prose dark:prose-invert">
        <p>
          你好，我是梓安。
        </p>
        <p>
          现年28岁，热爱一切科幻与技术，希望以一己之力为时代的变迁做一个小小的注脚。
        </p>
        <p>
          这里是我的个人博客，用于记录技术学习、项目经验以及生活感悟。
        </p>
        <h3>我的兴趣</h3>
        <ul>
          <li>Web 全栈开发 (React, Node.js, Go)</li>
          <li>系统架构设计</li>
          <li>开源项目贡献</li>
          <li>阅读与写作</li>
        </ul>
        <h3>联系我</h3>
        <p>
          你可以通过以下方式找到我：
        </p>
        <ul>
          <li>Email: 987161661@qq.com 或 a987161661@gmail.com</li>
          <li>Github: <a href="https://github.com/987161661" target="_blank" rel="noopener noreferrer">https://github.com/987161661</a></li>
        </ul>
      </div>
    </div>
  );
}
