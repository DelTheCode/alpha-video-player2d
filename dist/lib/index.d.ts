interface IOptions {
    url: string;
    el: HTMLCanvasElement | HTMLElement;
    width: number;
    height: number;
    loop?: boolean;
    autoplay?: boolean;
    loadedCallback?: Function;
    endCallback?: Function;
}
export default class VideoPlayer {
    private rafId;
    private opts;
    private isReady;
    private isPlaying;
    private context;
    private videoScript;
    private offlineCanvas;
    private offlineContext;
    constructor(opts: IOptions);
    handleEnd(): void;
    animation(): void;
    /**
     * 销毁
     * @memberof VideoPlayer
     */
    destory(): void;
    /**
     * 停止播放
     * @memberof VideoPlayer
     */
    pause(): void;
    /**
     * 开始播放
     * @memberof VideoPlayer
     */
    play(): void;
}
export {};
