'use client';
import React from 'react'
import { Md2PosterContent, Md2Poster, Md2PosterHeader, Md2PosterFooter } from 'markdown-to-poster'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image'

const defaultContentMd = `# AI的发展

人工智能(AI)正在以前所未有的速度发展，深刻改变着我们的生活方式。从ChatGPT到DALL-E，从自动驾驶到智能医疗，AI技术正在各个领域展现其强大潜力。

## 主要突破
1. **大语言模型**: GPT系列模型带来了自然语言处理的重大突破
2. **计算机视觉**: 在图像识别和生成领域取得显著进展
3. **智能决策**: 在游戏和复杂决策系统中超越人类表现

## 未来展望
- 更强大的多模态模型
- AI与各行业深度融合
- 负责任的AI发展和伦理规范

![AI发展](https://images.unsplash.com/photo-1677442136019-21780ecad995)
`

export default function PosterView() {
  // 需要根据url参数，作为mdString 的默认值
  const searchParams = useSearchParams()
  const mdString = decodeURIComponent(searchParams?.get('content')|| defaultContentMd) 
//   const headerString = decodeURIComponent(searchParams?.get('header') || 'News')
//   const footerString = decodeURIComponent(searchParams?.get('footer') || 'Powered by Powered by markdown-to-image-serve.jcommon.top')
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000; // 获取当前时区与UTC的时间差（以毫秒为单位）
  const localDate = new Date(now.getTime() - timezoneOffset);
  const dateString = localDate.toISOString().slice(0, 10);


  return (
    <div className="poster-content" style={{display: "inline-block"}}>
          {/* Preview */}
            <Md2Poster theme="SpringGradientWave" >
              <Md2PosterHeader  className="flex justify-center items-center px-4 font-medium text-lg">
              <span>{dateString} 【比特金矿】精选线报</span>
              </Md2PosterHeader>
              <Md2PosterContent>{mdString}</Md2PosterContent>
              <Md2PosterFooter className='text-center'>
                <img src="/Footer.png" alt="logo" />
              </Md2PosterFooter>
            </Md2Poster>
    </div>
  )
}
