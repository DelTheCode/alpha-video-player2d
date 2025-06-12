## 安装

```sh
npm i alpha-video-player2d --save
```

## 使用

```js
import AlphaVideoPlayer2D from 'alpha-video-player2d'
const video = new AlphaVideoPlayer2D({
  url: 'video.mp4',
  el: document.getElementById('player-container'),
  width: 375,
  height: 1080,
  loop: true,
  autoplay: true,
})
```

## 参数

```ts
interface IOptions {
  url: string; // 视频地址
  el: HTMLCanvasElement | HTMLElement; // 视频容器或画布
  width: number; // 视频宽度的一半
  height: number; // 视频高度
  loop?: boolean;
  autoplay?: boolean;
  loadedCallback?: Function;
  endCallback?: Function;
}
```
