# 环境
window 11
4070


# 前置
## 安装conda、cuda
Anaconda3-5.3.1-Windows-x86_64.exe
cuda_12.8.0_571.96_windows.exe

## 创建一个 python=3.10 的虚拟环境
conda create -n live-talking python=3.10

## 终端切换到项目根目录 并指定虚拟环境
conda activate live-talking

## 在虚拟环境中安装 cuda(12.8) 对应版本的 Pytorch
conda install pytorch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 pytorch-cuda=12.4 -c pytorch -c nvidia
如果cuda版本不为12.8 运行nvidia-smi确认版本，根据https://pytorch.org/get-started/previous-versions/安装对应版本的pytorch

## 下载并放置模型
百度网盘: https://pan.baidu.com/s/1yOsQ06-RIDTJd3HFCw4wtA 密码: ltua
GoogleDriver: https://drive.google.com/drive/folders/1FOC_MD6wdogyyX_7V1d4NDIO7P9NlSAJ?usp=sharing

将 wav2lip256.pth 拷到本项目的 models 下, 重命名为 wav2lip.pth；
将 s3fd.pth 拷到本项目 wav2lip/face_detection/detection/sfd/s3fd.pth；
将 wav2lip256_avatar1.tar.gz 解压后整个文件夹拷到本项目的 data/avatars 下；

## 安装依赖
pip install -r requirements.txt


# 启动
python app.py --transport webrtc --model wav2lip --max_session 3
--model wav2lip 指定 模型 为 wav2lip
--max_session 2 指定 最大会话数 为 2
## 启动成功后
用浏览器打开 http://127.0.0.1:8010/test.html 即可看到效果


# 生成数字人
cd wav2lip
python genavatar.py --video_path xxx.mp4 --img_size 256 --avatar_id wav2lip256_avatar2
--video_path 指定 视频路径
--avatar_id 指定 数字人id
生成好的数字人在results/avatars目录下


# 使用
## 接口（新建会话）
POST /offer 
## 参数
|名称|类型|描述|必填|
|--|--|--|--|
|sdp|string|sdp|是|
|type|string|type|是|
|avatar_id|string|数字人id|是|
|opt.voice|string|数字人voice|是|

## 接口（播放文字）
POST /human 
## 参数
|名称|类型|描述|必填|
|--|--|--|--|
|text|string|文字内容|是|
|type|'echo'|echo跟读|是|
|interrupt|true|interrupt|是|
|sessionid|string|/offer 接口返回的会话id|是|


# voice
|名称|性别|类型|特点|
|--|--|--|--|
|el-GR-AthinaNeural|女|通用|友好、积极|
|el-GR-NestorasNeural|男|通用|友好、积极|
|en-AU-NatashaNeural|女|通用|友好、积极|
|en-AU-WilliamNeural|男|通用|友好、积极|
|en-CA-ClaraNeural|女|通用|友好、积极|
|en-CA-LiamNeural|男|通用|友好、积极|
|en-GB-LibbyNeural|女|通用|友好、积极|
|en-GB-MaisieNeural|女|通用|友好、积极|
|en-GB-RyanNeural|男|通用|友好、积极|
|en-GB-SoniaNeural|女|通用|友好、积极|
|en-GB-ThomasNeural|男|通用|友好、积极|
|en-HK-SamNeural|男|通用|友好、积极|
|en-HK-YanNeural|女|通用|友好、积极|
|en-IE-ConnorNeural|男|通用|友好、积极|
|en-IE-EmilyNeural|女|通用|友好、积极|
|en-IN-NeerjaExpressiveNeural|女|通用|友好、积极|
|en-IN-NeerjaNeural|女|通用|友好、积极|
|en-IN-PrabhatNeural|男|通用|友好、积极|
|en-KE-AsiliaNeural|女|通用|友好、积极|
|en-KE-ChilembaNeural|男|通用|友好、积极|
|en-NG-AbeoNeural|男|通用|友好、积极|
|en-NG-EzinneNeural|女|通用|友好、积极|
|en-NZ-MitchellNeural|男|通用|友好、积极|
|en-NZ-MollyNeural|女|通用|友好、积极|
|en-PH-JamesNeural|男|通用|友好、积极|
|en-PH-RosaNeural|女|通用|友好、积极|
|en-SG-LunaNeural|女|通用|友好、积极|
|en-SG-WayneNeural|男|通用|友好、积极|
|en-TZ-ElimuNeural|男|通用|友好、积极|
|en-TZ-ImaniNeural|女|通用|友好、积极|
|en-US-AnaNeural|女|卡通、对话|可爱|
|en-US-AndrewMultilingualNeural|男|对话、副驾驶（辅助）|热情、自信、真实、诚实|
|en-US-AndrewNeural|男|对话、副驾驶（辅助）|热情、自信、真实、诚实|
|en-US-AriaNeural|女|新闻、小说|积极、自信|
|en-US-AvaMultilingualNeural|女|对话、副驾驶（辅助）|善于表达、体贴、令人愉快、友好|
|en-US-AvaNeural|女|对话、副驾驶（辅助）|善于表达、体贴、令人愉快、友好|
|en-US-BrianMultilingualNeural|男|对话、副驾驶（辅助）|平易近人、随意、真诚|
|en-US-BrianNeural|男|对话、副驾驶（辅助）|平易近人、随意、真诚|
|en-US-ChristopherNeural|男|新闻、小说|可靠、权威|
|en-US-EmmaMultilingualNeural|女|对话、副驾驶（辅助）|开朗、清晰、健谈|
|en-US-EmmaNeural|女|对话、副驾驶（辅助）|开朗、清晰、健谈|
|en-US-EricNeural|男|新闻、小说|理性|
|en-US-GuyNeural|男|新闻、小说|充满激情|
|en-US-JennyNeural|女|通用|友好、体贴、令人舒适|
|en-US-MichelleNeural|女|新闻、小说|友好、令人愉快|
|en-US-RogerNeural|男|新闻、小说|充满活力|
|en-US-SteffanNeural|男|新闻、小说|理性|
|en-ZA-LeahNeural|女|通用|友好、积极|
|en-ZA-LukeNeural|男|通用|友好、积极|
|es-AR-ElenaNeural|女|通用|友好、积极|
|es-AR-TomasNeural|男|通用|友好、积极|
|es-BO-MarceloNeural|男|通用|友好、积极|
|es-BO-SofiaNeural|女|通用|友好、积极|
|es-CL-CatalinaNeural|女|通用|友好、积极|
|es-CL-LorenzoNeural|男|通用|友好、积极|
|es-CO-GonzaloNeural|男|通用|友好、积极|
|es-CO-SalomeNeural|女|通用|友好、积极|
|es-CR-JuanNeural|男|通用|友好、积极|
|es-CR-MariaNeural|女|通用|友好、积极|
|es-CU-BelkysNeural|女|通用|友好、积极|
|es-CU-ManuelNeural|男|通用|友好、积极|
|es-DO-EmilioNeural|男|通用|友好、积极|
|es-DO-RamonaNeural|女|通用|友好、积极|
|es-EC-AndreaNeural|女|通用|友好、积极|
|es-EC-LuisNeural|男|通用|友好、积极|
|es-ES-AlvaroNeural|男|通用|友好、积极|
|es-ES-ElviraNeural|女|通用|友好、积极|
|es-ES-XimenaNeural|女|通用|友好、积极|
|es-GQ-JavierNeural|男|通用|友好、积极|
|es-GQ-TeresaNeural|女|通用|友好、积极|
|es-GT-AndresNeural|男|通用|友好、积极|
|es-GT-MartaNeural|女|通用|友好、积极|
|es-HN-CarlosNeural|男|通用|友好、积极|
|es-HN-KarlaNeural|女|通用|友好、积极|
|es-MX-DaliaNeural|女|通用|友好、积极|
|es-MX-JorgeNeural|男|通用|友好、积极|
|es-NI-FedericoNeural|男|通用|友好、积极|
|es-NI-YolandaNeural|女|通用|友好、积极|
|es-PA-MargaritaNeural|女|通用|友好、积极|
|es-PA-RobertoNeural|男|通用|友好、积极|
|es-PE-AlexNeural|男|通用|友好、积极|
|es-PE-CamilaNeural|女|通用|友好、积极|
|es-PR-KarinaNeural|女|通用|友好、积极|
|es-PR-VictorNeural|男|通用|友好、积极|
|es-PY-MarioNeural|男|通用|友好、积极|
|es-PY-TaniaNeural|女|通用|友好、积极|
|es-SV-LorenaNeural|女|通用|友好、积极|
|es-SV-RodrigoNeural|男|通用|友好、积极|
|es-US-AlonsoNeural|男|通用|友好、积极|
|es-US-PalomaNeural|女|通用|友好、积极|
|es-UY-MateoNeural|男|通用|友好、积极|
|es-UY-ValentinaNeural|女|通用|友好、积极|
|es-VE-PaolaNeural|女|通用|友好、积极|
|es-VE-SebastianNeural|男|通用|友好、积极|
|et-EE-AnuNeural|女|通用|友好、积极|
|et-EE-KertNeural|男|通用|友好、积极|
|zh-CN-XiaoxiaoNeural|女|新闻、小说|温暖|
|zh-CN-XiaoyiNeural|女|卡通、小说|活泼|
|zh-CN-YunjianNeural|男|体育、小说|充满激情|
|zh-CN-YunxiNeural|男|小说|活泼、阳光|
|zh-CN-YunxiaNeural|男|卡通、小说|可爱|
|zh-CN-YunyangNeural|男|新闻|专业、可靠|
|zh-CN-liaoning-XiaobeiNeural|女|方言|幽默|
|zh-CN-shaanxi-XiaoniNeural|女|方言|开朗|
|zh-HK-HiuGaaiNeural|女|通用|友好、积极|
|zh-HK-HiuMaanNeural|女|通用|友好、积极|
|zh-HK-WanLungNeural|男|通用|友好、积极|
|zh-TW-HsiaoChenNeural|女|通用|友好、积极|
|zh-TW-HsiaoYuNeural|女|通用|友好、积极|
|zh-TW-YunJheNeural|男|通用|友好、积极|