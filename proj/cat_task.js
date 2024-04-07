'ui';
'http';

importClass(android.annotation.SuppressLint);
importClass(android.content.Intent);
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.graphics.Paint);
importClass(android.net.Uri);
importClass(android.os.Bundle);
importClass(android.provider.Settings);
importClass(android.view.View);
importClass(android.view.WindowManager);

// 全局函数封装
function setBackgroundRounded(view){/* 对话框背景与圆角设置 */
    let gradientDrawable = new GradientDrawable();
    gradientDrawable.setShape(GradientDrawable.RECTANGLE);
    gradientDrawable.setColor(colors.parseColor("#ffffff"));
    gradientDrawable.setCornerRadius(60);
    view.setBackgroundDrawable(gradientDrawable);
};

// 状态栏透明设置
activity.window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
activity.window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
activity.window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
activity.window.setStatusBarColor(Color.TRANSPARENT);


// 2#1-商店“课程”分类子页面-0-界面
ui.layout(
    <frame bg='#000000' gravity='horizontal_center'>
        <ScrollView>
        <vertical margin='15 110 15 10'>
                <list id='list' w='*' margin='0 0 0 100'>
                    <card w='330' h='280' margin='0 10 0 10' cardCornerRadius='30dp' cardElevation='1dp'>
                        <vertical bg='file://./res/card/buyCard.png'>
                            <vertical>
                                <text w='260' h='50' margin='40 25 0 0' text='{{this.name}}' size='18' color='#000000' textStyle='bold'/>
                                <horizontal margin='25 16 0 0'>
                                    <text text='作者' size='12' color='#ffffff'/>
                                    <text marginLeft='10' text='{{this.author}}' size='12' color='#000000'/>
                                </horizontal>
                                <horizontal margin='25 8 0 0'>
                                    <text text='编号' size='12' color='#ffffff'/>
                                    <text marginLeft='10' text='{{this.code}}' size='12' color='#000000'/>
                                </horizontal>
                                <horizontal margin='25 8 0 0'>
                                    <text text='平台' size='12' color='#ffffff'/>
                                    <text marginLeft='10' text='{{this.platform}}' size='12' color='#000000'/>
                                </horizontal>
                            </vertical>
                            <horizontal gravity='center' margin='0 55 0 0'>
                                <button id='more' w='120' margin='0 0 30 0' text='详情' textSize='14' textColor='#ffffff' style='Widget.AppCompat.Button.Borderless'/>
                                <button id='download' w='120' text='下载' textSize='14' textColor='#000000' style='Widget.AppCompat.Button.Borderless'/>
                            </horizontal>
                        </vertical>
                        <relative>
                            <vertical margin='190 100 0 0'>
                                <horizontal>
                                    <text text='￥' size='24' color='#ffffff' textStyle='bold'/>
                                    <text text='{{this.price}}' size='30' color='#ffffff' textStyle='bold'/>
                                </horizontal>
                            </vertical>
                        </relative>
                    </card>
                </list>
            </vertical>
        </ScrollView>
        {/* 工具栏 */}
        <relative>
            <horizontal margin='20 50 0 0'>
                <card gravity='center' w='40' h='40' marginRight='20' cardCornerRadius='40dp' cardElevation='1dp'>
                    <vertical w='30' h='30' bg='@drawable/ic_arrow_back_black_48dp'>
                        <button id='back_main' w='30' h='30' style='Widget.AppCompat.Button.Borderless'/>
                    </vertical>
                </card>
                <card gravity='center|right' w='260' h='40' cardCornerRadius='40dp' cardElevation='1dp'>
                    <horizontal gravity='center'>
                        <input id='input' w='160' marginLeft='10' bg='#ffffff' hint='请输入搜索内容' textSize='16' textColorHint='#bbbbbb'/>
                        <vertical w='30' h='30' marginRight='10' bg='@drawable/ic_search_black_48dp'>
                            <button id='search' w='30' h='30' style='Widget.AppCompat.Button.Borderless'/>
                        </vertical>
                        <vertical w='30' h='30' bg='@drawable/ic_refresh_black_48dp'>
                            <button id='reset' w='30' h='30' style='Widget.AppCompat.Button.Borderless'/>
                        </vertical>
                    </horizontal>
                </card>
            </horizontal>
        </relative>
    </frame>
);
// 2#1-商店“课程”分类子页面-1-退出页面
ui.back_main.on("click", function(){
    exit();
});
// 2#1-商店“课程”分类子页面-2-资源列表生成
const infoContent = files.read('./info_task.json');
var res = JSON.parse(infoContent);
ui.list.setDataSource(res);
// // 2#1-商店“课程”分类子页面-3-刷新资源
toast('点击刷新按钮刷新资源！')
ui.reset.on('click', function(){
    let resetDialogView = ui.inflate(
    <list id='content'>
        <text text='{{this}}' textColor='#555555'/>
    </list>
    );
    resetDialogView.setDataSource(['刷新资源您可以看到最新的脚本资源列表。']);
    let resetDialog = dialogs.build({
        customView: resetDialogView,
        title: '是否刷新脚本资源',
        titleColor: '#000000',
        positive: '确定刷新',
        positiveColor: '#000000',
        negative: '取消刷新',
        negativeColor: '#000000',
    }).on("positive", function(){
        Upgrade();
    }).on("negative", function(){
        resetDialog.dismiss();
    });
    let resetDialogWindow = resetDialog.getWindow();
    setBackgroundRounded(resetDialogWindow);
    resetDialog.show();
    function Upgrade(){
        jsUrl = 'https://cdn.jsdelivr.net/gh/eliaszwc/eliaszwc.github.io/proj/cat_task.js'
        infoUrl = 'https://cdn.jsdelivr.net/gh/eliaszwc/eliaszwc.github.io/proj/info_task.json'
        toast('正在下载更新资源')
        http.get(jsUrl, {}, function(res, err){
            if(err){
                toast("下载资源失败: " + err);
                return;
            }
            if(res.statusCode === 200){
                let scriptContent = res.body.string();
                var savePath = engines.myEngine().cwd() + '/cat_task.js';
                files.write(savePath, scriptContent);
                engines.execScriptFile(savePath);
                toast('更新资源成功');
            } else {
                toast("下载资源失败，HTTP 状态码: " + res.statusCode);
                return;
            }
        });
        http.get(infoUrl, {}, function(res, err){
            if(err){
                toast("下载说明失败: " + err);
                return;
            }
            if(res.statusCode === 200){
                let scriptContent = res.body.string();
                var savePath = engines.myEngine().cwd() + '/info_task.json';
                files.write(savePath, scriptContent);
                engines.execScriptFile(savePath);
                toast('更新说明成功');
            } else {
                toast("下载说明失败，HTTP 状态码: " + res.statusCode);
                return;
            }
        });
    };
});
// 2#1-商店“课程”分类子页面-3-搜索功能
ui.input.addTextChangedListener({
    onTextChanged: function(text){
        if(text.length == 0) return;   
        var searchResult = res.filter(function(item){
            return item.author.includes(text) ||
            item.name.includes(text) ||
            item.platform.includes(text) ||
            item.school.includes(text) ||
            item.lesson.includes(text) ||
            item.schoolEng.includes(text);
        });
        ui.list.setDataSource(searchResult);
    }
});
// 2#1-商店“课程”分类子页面-4-卡片功能
ui.list.on('item_bind', (itemView, itemHolder) => {
    itemView.more.on('click', () => {/* 详情功能 */
    let item = itemHolder.item;
    var sequence = item.code.slice(3) - 1;
    var lesson = [res[sequence].lesson];
    var version = [res[sequence].version];
    var school = [res[sequence].school];
    var introduction = [res[sequence].introduction];
    var notice = [res[sequence].notice];
    var content = [{lesson: lesson, version: version, school: school, introduction: introduction, notice: notice}];
        let infoDialogView = ui.inflate(
        <list id='content'>
            <vertical>
                <horizontal>
                    <text text='课名：' textColor='#000000'/>
                    <text text='{{this.lesson}}' textColor='#555555'/>
                </horizontal>
                <horizontal>
                    <text text='版本：' textColor='#000000'/>
                    <text text='{{this.version}}' textColor='#555555'/>
                </horizontal>
                <horizontal>
                    <text text='学校：' textColor='#000000'/>
                    <text text='{{this.school}}' textColor='#555555'/>
                </horizontal>
                <horizontal>
                    <text text='简介：' textColor='#000000'/>
                    <text text='{{this.introduction}}' textColor='#555555'/>
                </horizontal>
                <horizontal>
                    <text text='注意：' textColor='#000000'/>
                    <text text='{{this.notice}}' textColor='#555555'/>
                </horizontal>
            </vertical>
        </list>
        );
        infoDialogView.content.setDataSource(content);
        let infoDialog = dialogs.build({
            customView: infoDialogView,
            title: '详情',
            titleColor: '#000000',
            positive: '知道了',
            positiveColor: '#000000',
            negative: '取消',
            negativeColor: '#000000',
        }).on("positive", function(){
            infoDialog.dismiss();
        }).on("negative", function(){
            infoDialog.dismiss();
        });
        let infoDialogWindow = infoDialog.getWindow();
        setBackgroundRounded(infoDialogWindow);
        infoDialog.show();
    });
    itemView.download.on("click", function(){/* 下载功能 */
        let item = itemHolder.item;
        var scriptName = item.code + '.js';
        var url = 'https://cdn.jsdelivr.net/gh/eliaszwc/eliaszwc.github.io/scr/' + scriptName;
        var savePath = '/sdcard/' + scriptName;
        verifyCode();
        function verifyCode(){
            let verifyCodeView = ui.inflate(
                <vertical padding='10'>
                    <horizontal h='80' bg='file://./res/bar/machineCode.png'>
                        <input id='machineCode' w='135' h='70' margin='90 5 0 0' bg='#000000' size='14' color='#ffffff'/>
                    </horizontal>
                    <horizontal h='80' bg='file://./res/bar/activationCode.png'>
                        <input id='activationCode' w='135' h='70' margin='90 5 0 0' bg='#000000' size='14' color='#ffffff' hint='您需要联系创作者（微信:cautowork）获得激活码' textColorHint='#aaaaaa'/>
                    </horizontal>
                    <img id='clip' h='60' marginTop='10' src='file://./res/bar/clip.png'/>
                    <img id='activate' h='60' src='file://./res/bar/activate.png'/>
                </vertical>
            );
            var authority = false
            var uuidCode = device.fingerprint + item.code
            var mc = md5(uuidCode)
            var code = md5(mc).toString()
            verifyCodeView.machineCode.setText(mc)
            verifyCodeView.clip.on('click', function(){
                setClip(mc)
                toast('机器码已复制');
            });
            verifyCodeView.activate.on('click', function(){
                var ac = verifyCodeView.activationCode.text()
                if(ac === code){
                    authority = true;
                    toast('激活成功，开始下载！');
                    downloadScript();
                }else{
                    toast('激活失败，请确定您输入的是正确的激活码！')
                }
            });
            let verifyDialog = dialogs.build({
                customView: verifyCodeView,
                title: '激活',
                titleColor: '#000000',
                negative: '取消',
                negativeColor: '#000000',
            }).on("negative", function(){
                verifyDialog.dismiss();
            });
            let verifyDialogWindow = verifyDialog.getWindow();
            setBackgroundRounded(verifyDialogWindow);
            verifyDialog.show();
        };
        function downloadScript(){/* 定义下载函数 */
            toast('正在下载脚本，请勿退出')
            http.get(url, {}, function(res, err){
                if(err){
                    toast("下载失败: " + err);
                    return;
                }
                if(res.statusCode === 200){
                    let scriptContent = res.body.string();
                    files.write(savePath, scriptContent);
                    toast('下载成功，请在您的程序页新建卡片使用此脚本！');
                } else {
                    toast("下载失败，HTTP 状态码: " + res.statusCode);
                }
            });
        };
        function md5(string){/* 定义MD5加密算法函数 */
            var res = java.math.BigInteger(1, java.security.MessageDigest.getInstance('MD5').digest(java.lang.String(string).getBytes())).toString(16);
            while(res.length < 32)res = '0' + res;
            return res
        };
    });
});