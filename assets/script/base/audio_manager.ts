
export default class AudioManager {

    private static _instance: AudioManager = null;
    public static get Instance(): AudioManager {
        if (this._instance == null) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    private _musicVolume: number = 0;
    private _effectVolume: number = 0;
    private _audioId: number = 0;
    private _currentMusic: string = null;
    public get currentMusic() : string {
        return this._currentMusic;
    }
    

    init() {
        console.log("audio manager init ...");
        let musicVolume = cc.sys.localStorage.getItem('3kingdom_musicVolume');
        if (musicVolume) {
            this._musicVolume = musicVolume;
        } else {
            this._musicVolume = 0.5;
        }
        cc.audioEngine.setMusicVolume(this._musicVolume);
        let effectVolume = cc.sys.localStorage.getItem('3kingdom_effectVolume');
        if (effectVolume) {
            this._effectVolume = effectVolume;
        } else {
            this._effectVolume = 0.5;
        }
        cc.audioEngine.setEffectsVolume(this._effectVolume);
    }

    /**是否在播放背景音乐 */
    isPlayingMusic() {
        return this._audioId > 0;
    }

    /**播放音乐 */
    playMusic(filename: string, isloop: boolean) {
        if (this._audioId > 0) {
            cc.audioEngine.stop(this._audioId);
        }
        cc.resources.load("music/" + filename, cc.AudioClip, (err, clip: cc.AudioClip) => {
            if (err) {
                return;
            }
            this._audioId = cc.audioEngine.playMusic(clip, isloop);
            this._currentMusic = filename;
        })
    }

    /**播放音效 */
    playEffect(filename) {
        cc.resources.load(filename, cc.AudioClip, (err, clip: cc.AudioClip) => {
            if (err) {
                return;
            }
            cc.audioEngine.playEffect(clip, false);
        })
    }

    setMusicVolume(v) {
        if (this._audioId >= 0) {
            if (v > 0) {
                cc.audioEngine.resumeMusic();
            } else {
                cc.audioEngine.pauseMusic();
            }
        }
        if (this._musicVolume != v) {
            this._musicVolume = v;
            cc.audioEngine.setMusicVolume(v);
            cc.sys.localStorage.setItem("3kingdom_musicVolume", v);
        }
    }

    setEffectVolume(v) {
        if (this._effectVolume != v) {
            this._effectVolume = v;
            cc.sys.localStorage.setItem("3kingdom_effectVolume", v);
        }
    }

    getMusicVolume() {
        return this._musicVolume;
    }

    getEffectVolume() {
        return this._effectVolume;
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }

    stopAll() {
        this._audioId = 0;
        cc.audioEngine.stopAll();
    }

}
