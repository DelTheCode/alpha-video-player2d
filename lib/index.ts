
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

export default class VideoPlayer {
  private rafId = -1;
  private opts: IOptions;
  private isReady = false;
  private isPlaying = false;

  private context: CanvasRenderingContext2D | null;
  private videoScript: HTMLVideoElement;

  private offlineCanvas: HTMLCanvasElement | null = null;
  private offlineContext: CanvasRenderingContext2D | null = null;


  constructor(opts: IOptions) {
    this.rafId = -1;
    this.opts = opts || <IOptions>{};
    
    const { url, el } = opts;

    let canvas: HTMLCanvasElement;
    if (el instanceof HTMLCanvasElement) {
      canvas = el;
    } else {
      canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      el.appendChild(canvas);
    }
    // const dpr = window.devicePixelRatio || 1;
    // fix: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': Out of memory at ImageData creation
    const dpr = 1;
    canvas.width = opts.width * dpr;
    canvas.height = opts.height * dpr;

    this.context = canvas.getContext("2d");

    // 创建video元素
    this.videoScript = document.createElement("video");
    this.videoScript.width = opts.width * 2;
    this.videoScript.height = opts.height;
    this.videoScript.controls = false;
    this.videoScript.playsInline = true;
    this.videoScript.loop = opts.loop || false;
    this.videoScript.autoplay = false;
    this.videoScript.muted = true;
    this.videoScript.crossOrigin = "Anonymous";
    // @ts-ignore
    this.videoScript["x5-video-player-type"] = "h5";

    this.videoScript.src = url;
    this.videoScript.addEventListener('loadedmetadata', () => {
      // const videoWidth = this.videoScript.videoWidth;
      // const videoHeight = this.videoScript.videoHeight;
      // console.log('视频宽度：', videoWidth);
      // console.log('视频高度：', videoHeight);
      this.isReady = true;
      if (opts.loadedCallback) opts.loadedCallback();
      if (opts.autoplay) this.play();
    });
    this.videoScript.addEventListener("ended", this.handleEnd);

    // 创建一个离屏canvas，用于绘制video
    const offlineCanvas = document.createElement("canvas");
    offlineCanvas.width = opts.width * dpr * 2;
    offlineCanvas.height = opts.height * dpr;
    this.offlineCanvas = offlineCanvas;
    this.offlineContext = offlineCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  handleEnd() {
    if (!this.opts.loop) this.pause();
    if (this.opts.endCallback) this.opts.endCallback();
  }

  animation() {
    // 视频未准备好，不做处理
    if (!this.isReady) {
      this.rafId = requestAnimationFrame(() => {
        this.animation();
      });
      return;
    }
    const { context, offlineContext } = this;
    if (!context || !offlineContext) {
      console.error("canvas context is null");
      return;
    }
    // 先获取离线画布的数据，然后绘制到主画布上
    const oW = this.offlineCanvas!.width;
    const oH = this.offlineCanvas!.height;
    offlineContext.drawImage(this.videoScript, 0, 0, oW, oH);
    const imgdata2 = offlineContext.getImageData(0, 0, oW / 2, oH);
    const imgdata1 = offlineContext.getImageData(oW / 2, 0, oW / 2, oH);

    // 将imgdata2的alpha通道数据赋值给imgdata1的alpha通道数据
    const data2 = imgdata2.data;
    for (let i = 3, n = data2.length; i < n; i += 4) {
      imgdata1.data[i] = data2[i - 3];
    }
    const newImageData = imgdata1;
    context.putImageData(newImageData, 0, 0, 0, 0, oW / 2, oH);
    // 如果正在播放中，继续下一帧的绘制
    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(() => {
        this.animation();
      });
    }
  }


  /**
   * 销毁
   * @memberof VideoPlayer
   */
  destory() {
    this.pause(); // 停止播放
    this.videoScript.removeEventListener("ended", this.handleEnd);
    if (this.offlineCanvas && this.offlineCanvas.remove) {
      this.offlineCanvas.remove();
    }
    if (this.videoScript && this.videoScript.remove) {
      this.videoScript.remove();
    }
  }


  /**
   * 停止播放
   * @memberof VideoPlayer
   */
  pause() {
    this.videoScript.pause();
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = -1;
    }
  }


  /**
   * 开始播放
   * @memberof VideoPlayer
   */
  play() {
    // 先取消之前的播放
    if (this.rafId && cancelAnimationFrame) {
      cancelAnimationFrame(this.rafId);
      this.rafId = -1;
    }
    this.videoScript.play();
    this.isPlaying = true;
    this.animation();
  }
}
