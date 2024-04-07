// 使用ui模式
'ui';
'http';

// 导入类
importClass(android.animation.AnimatorListenerAdapter);
importClass(android.animation.ObjectAnimator);
importClass(android.annotation.SuppressLint);
importClass(android.content.Intent);
importClass(android.graphics.Color);
importClass(android.graphics.drawable.GradientDrawable);
importClass(android.graphics.Paint);
importClass(android.graphics.PaintFlagsDrawFilter);
importClass(android.net.Uri);
importClass(android.os.Bundle);
importClass(android.provider.Settings);
importClass(android.util.TypedValue);
importClass(android.view.View);
importClass(android.view.WindowManager);

// 版本号
const version = "1.0.0.beta"

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

// 导航栏设定
var tabs_data = {/* 导航数据预设 */
    bg: "#000000",
    selectColor: {on: "#ffffff", off: "#888888"},
    srcSize: 24,
    textSize: 12,
    zoom: 1.2,/* 动画缩放比例 */
    tabs_h: true,/* 指示器小横条 */
    data: [
        ["程序", "@drawable/ic_storage_black_48dp"],
        ["商店", "@drawable/ic_store_black_48dp"],
        ["通知", "@drawable/ic_notifications_black_48dp"],
        ["个人", "@drawable/ic_person_black_48dp"],
    ],
};
var tabs_view = [];
var selectView = 0;/* 默认选中的导航标签页 */
var Tabs_btn_layout = function(){/* 自定义tabs按钮 */
    util.extend(Tabs_btn_layout, ui.Widget);/* 在继承ui.Widget基础上定义 */
    function Tabs_btn_layout(){
        ui.Widget.call(this);/* 调用父类ui.Widget函数来构造 */
        this.defineAttr('data', (view, attr, value, defineSetter) => {/* 重新设置控件参数 */
            arr = tabs_data.data[value];/* 将预设tabs数据中的图标和文字内容传入arr */
            view._text.setText(arr[0]);/* 由text参数传入预设的文字 */
            view._src.attr("src", arr[1]);/* 由src参数传入预设的图标 */
            tabs_view[tabs_view.length] = view;/* 把控件信息集合到view里 */
            if(value == selectView){/* 选中时的变色设置 */
                view._src.attr("tint", tabs_data.selectColor.on)
                view._text.setTextColor(colors.parseColor(tabs_data.selectColor.on))
            }
        });
    };
    Tabs_btn_layout.prototype.render = function(){/* 用于渲染Tabs_btn_layout对象 */
        return(/* 套用预设的tabs数据 */
            <frame>
                <vertical id='_bg' gravity="center" w="90" h='50' padding="0 10" bg="{{tabs_data.bg}}">
                    <img id="_src" w="30" tint="{{tabs_data.selectColor.off}}"/>
                </vertical>
                <relative margin='33 40 0 0'>
                    <text id="_text" w="auto" textSize="{{tabs_data.textSize}}" textColor="{{tabs_data.selectColor.off}}"/>
                </relative>
            </frame>
        );
    };
    ui.registerWidget("tabs_btn-layout", Tabs_btn_layout);/* 将Tabs_btn_layout注册到ui框架中 */
    return Tabs_btn_layout;
}();
var Tabs_layout = function(){/* 自定义tabs控件 */
    util.extend(Tabs_layout, ui.Widget);
    function Tabs_layout(){
        ui.Widget.call(this);
        this.defineAttr('data', (view, attr, value, defineSetter) => {
            for(var i = 0; i < tabs_data.data.length; i++){/* 遍历各个tab */
                time = i;/* 设置time的排序顺序 */
                ui.inflate(<tabs_btn-layout data="{{time}}" />, view._tabs, true);/* 向自定义的控件传入time */
            }
            tabs_data.tabs_h ? _color = tabs_data.selectColor.on : _color = "#00000000";
            view.tabs.selectedTabIndicatorColor = colors.parseColor(_color);/* 设置tabs指示器颜色 */
        });
    };
    Tabs_layout.prototype.render = function(){/* 渲染Tabs_layout对象 */
        return (
            <card w="*" h="80" cardElevation="5" foreground="?selectableItemBackground">
                <horizontal id="_tabs" />
                <tabs id="tabs" />
            </card>
        )
    };
    ui.registerWidget("tabs-layout", Tabs_layout);
    return Tabs_layout;
}();

// 0#根页面-0-界面
ui.layout(
    <drawer id="drawer">
        <vertical bg='#000000'>

            {/* 工具栏 */}
            <appbar>
                <toolbar id="toolbar" title='' bg='#000000' padding='0 45 0 0'/>
            </appbar>

            {/* 主页 */}
            <viewpager id="viewpager">

                {/* 程序标签页 */}
                <frame id='programmes'>
                    <card gravity='center' h='54' margin='20 0' cardCornerRadius='30dp' cardElevation='1dp'>
                        <vertical gravity='center' margin='2 0' bg='#ffffff'>
                            <card gravity='center_vertical' h='50' cardCornerRadius='30dp' cardElevation='1dp'>
                                <tabs id='programmesTabs' h='60' bg='#000000'/>
                            </card>
                        </vertical>
                    </card>
                    <viewpager id='programmesView'>
                        <frame>
                            <ScrollView>
                                <vertical id='scripts'>
                                    {/* 程序看板 */}
                                    <vertical gravity='center' marginTop='70'>
                                        <list id="cardList">
                                            <card gravity='center_vertical' w='340' h='230' margin='10 5' cardCornerRadius='30dp' cardElevation='1dp'>
                                                <vertical bg='file://./res/card/scriptCard.jpeg'>
                                                    <vertical padding='40 10 0 0'>
                                                        <text w='260' h='50' marginTop='20' text='{{this.cardTitle}}' size='18' color='#ffffff'/>
                                                        <text w='150' h='50' text='{{this.cardSummary}}' size='12' color='#eeeeee'/>
                                                    </vertical>
                                                    <horizontal gravity='center' margin='0 33 10 10'>
                                                        <text w='200' margin='20 0 40 0' text='NO.{{this.cardCode}}' size='14' color='#000000'/>
                                                        <card gravity='center' w='50' h='50' cardCornerRadius='50dp' cardElevation='1dp'>
                                                            <img src='@drawable/ic_play_arrow_black_48dp' tint='#ffffff' w='65' h='65' padding='16' bg='#000000'/>
                                                            <button id='run' style='Widget.AppCompat.Button.Borderless'/>
                                                        </card>
                                                    </horizontal>
                                                </vertical>
                                            </card>
                                        </list>
                                        {/* 避免遮挡 */}
                                        <vertical h='150'></vertical>
                                    </vertical>

                                </vertical>
                            </ScrollView>
                            <relative>
                                <horizontal margin='20 550 10 0'>
                                    <card gravity='center' w='245' cardCornerRadius='50dp' cardElevation='1dp'>
                                        <button id='stop' bg='#ffffff' text='停止正在航行的脚本' textColor='#000000' textStyle='bold' style='Widget.AppCompat.Button.Borderless'/>
                                    </card>
                                    <card gravity='center' w='50' h='50' marginLeft='20' cardCornerRadius='50dp' cardElevation='1dp'>
                                        <img src='@drawable/ic_add_black_48dp' tint='#000000' w='65' h='65' padding='16' bg='#ffffff'/>
                                        <button id='add' style='Widget.AppCompat.Button.Borderless'/>
                                    </card>
                                </horizontal>
                            </relative>
                        </frame>
                        <frame></frame>
                        <frame></frame>
                    </viewpager>
                </frame>

                {/* 商店标签页 */}
                <frame id='store'>
                    <ScrollView>
                        <vertical gravity='center'>
                            {/* 宣传板 */}
                            <horizontal gravity='center' h='250' marginTop='10'>
                                <img src='file://./res/card/billboard.jpeg'/>
                            </horizontal>
                            {/* 分类栏 */}
                            <vertical margin='10 20 10 0'>
                                <text padding='10' size='20' color='#888888'>分类 | Category</text>
                                <horizontal gravity='center' marginTop='10'>
                                    <card w='50' h='70' marginRight='35'>
                                        <vertical bg='file://./res/icon/icon_lesson.jpeg' w='50' h='70'>
                                            <button id='category_lesson' w='50' h='70' style='Widget.AppCompat.Button.Borderless'/>
                                        </vertical>
                                    </card>
                                    <card w='50' h='70' marginRight='35'>
                                        <vertical bg='file://./res/icon/icon_task.jpeg' w='50' h='70'>
                                            <button id='category_task' w='50' h='70' style='Widget.AppCompat.Button.Borderless'/>
                                        </vertical>
                                    </card>
                                    <card w='50' h='70' marginRight='35'>
                                        <vertical bg='file://./res/icon/icon_ticket.jpeg' w='50' h='70'>
                                            <button id='category_ticket' w='50' h='70' style='Widget.AppCompat.Button.Borderless'/>
                                        </vertical>
                                    </card>
                                    <card w='50' h='70'>
                                        <vertical bg='file://./res/icon/icon_video.jpeg' w='50' h='70'>
                                            <button id='category_video' w='50' h='70' style='Widget.AppCompat.Button.Borderless'/>
                                        </vertical>
                                    </card>
                                </horizontal>
                            </vertical>
                            {/* 定制卡片 */}
                            <card w='320' h='170' margin='10 30 10 100' cardCornerRadius='30dp' cardElevation='1dp'>
                                <img src='file://./res/page/customization.png'/>
                                <card layout_gravity='bottom|right' w='100' h='40' margin='0 0 12 12' cardCornerRadius='30dp' cardElevation='1dp'>
                                    <img id='customization' src='file://./res/page/customize.png'/>
                                </card>
                            </card>
                        </vertical>
                    </ScrollView>
                </frame>

                {/* 通知标签页 */}
                <frame id='notification'>
                    <img id='notifications' h='650' src='file://./res/page/notification.png'/>
                </frame>

                {/* 个人标签页 */}
                <frame id='personal'>
                    <img id='login' h='650' src='file://./res/page/person.png'/>
                </frame>
            </viewpager>
        </vertical>

        {/* 导航栏 */}
        <relative gravity='bottom|center'>
            <tabs-layout bg='#000000' data=''/>
        </relative>

        {/* 侧拉菜单 */}
        <vertical layout_gravity='left' w='300' padding='10 300 10 0' bg='file://./res/page/sidemenu.jpeg'>
            {/* 无障碍服务 */}
            <horizontal gravity='center_vertical'>
                <img src='@drawable/ic_android_black_48dp' tint='#bbbbbb' w='50' h='50' padding='16'/>
                <Switch id='autoService' checked='{{auto.service != null}}' w='220' text='无障碍服务' textSize='16sp' textColor='#bbbbbb'/>
            </horizontal>
            {/* 悬浮窗 */}
            <horizontal gravity='center_vertical'>
                <img src='@drawable/ic_tab_black_48dp' tint='#bbbbbb' w='50' h='50' padding='16'/>
                <Switch id='floatingWindow' checked='{{floaty.checkPermission() != false}}' w='220' text='悬浮舷窗' textSize='16sp' textColor='#bbbbbb'/>
            </horizontal>
            {/* 剩余选项 */}
            <list id='sidemenu'>
                <horizontal gravity='center_vertical' w='*' bg='?selectableItemBackground'>
                    <img src='{{this.sidemenuIcon}}' tint='#bbbbbb' w='50' h='50' padding='16'/>
                    <text layout_gravity='center' text='{{this.sidemenuTitle}}' textSize='15sp' textColor='#bbbbbb'/>
                </horizontal>
            </list>
        </vertical>

    </drawer>
    
);
// 0#根页面-1-根视图与多页面设置
const ViewGroup = activity.getWindow().getDecorView().findViewById(android.R.id.content).getChildAt(0)
var SystemUiVisibility = (ve) => {
    var option =
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
        (ve ? View.SYSTEM_UI_FLAG_LAYOUT_STABLE : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    activity.getWindow().getDecorView().setSystemUiVisibility(option);
};
// 0#根页面-2-工具栏设置
ui.emitter.on('create_options_menu', menu=>{/* 创建右上角菜单 */
    menu.add('设置');
    menu.add('版本');
});
ui.emitter.on('options_item_selected', (e, item)=>{/* 监听选项菜单点击 */
    switch(item.getTitle()){
        case '设置':
            toast('还没有设置');
            break;
        case '版本':
            alert('版本', 'Cauto v' + version);
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);
// 0#根页面-3-导航栏设置
ui.tabs.setupWithViewPager(ui.viewpager);/* 让滑动页面和标签栏指示器联动 */
ui.toolbar.setupWithDrawer(ui.drawer);/* 根页面显示 */
ui.viewpager.setOnPageChangeListener({
    //已选定页面发生改变时触发
    onPageSelected: function (index) {
        //设置selectView上次页面 图案和字体颜色为未选中颜色 tabs_data.selectColor.off
        tabs_view[selectView]._src.attr("tint", tabs_data.selectColor.off)
        tabs_view[selectView]._text.setTextColor(colors.parseColor(tabs_data.selectColor.off))
        //设置当前页面 图案和字体颜色为选中颜色 tabs_data.selectColor.on
        tabs_view[index]._src.attr("tint", tabs_data.selectColor.on)
        tabs_view[index]._text.setTextColor(colors.parseColor(tabs_data.selectColor.on))
        //设置当前页面为 index
        selectView = index
    }
});
// 0#根页面-3-侧拉菜单设置
ui.sidemenu.setDataSource([
  {
    sidemenuTitle: '太空漫游须知',
    sidemenuIcon: '@drawable/ic_info_black_48dp'
  },
  {
    sidemenuTitle: '检查飞船更新',
    sidemenuIcon: '@drawable/ic_update_black_48dp'
  },
  {
    sidemenuTitle: '结束航行',
    sidemenuIcon: '@drawable/ic_exit_to_app_black_48dp'
  }
]);
function updateVersion(){/* 检查更新 */
    toast('正在检查更新...');
    var versionUrl = 'https://cdn.jsdelivr.net/gh/eliaszwc/eliaszwc.github.io/version.json';
    threads.start(function(){
        var versionResponse = http.get(versionUrl);
        var versionJson = versionResponse.body.json();
        var newVName = versionJson.version_name;
        var newVUrl = versionJson.apk_download_url;
        if(version !== newVName){
            let updateDialogView = ui.inflate(
                <list id='content'>
                    <text text='{{this}}' textColor='#cccccc'/>
                </list>
            );
            updateDialogView.content.setDataSource(['检测到新版本' + newVName + '，是否更新？']);
            let updateDialog = dialogs.build({
                customView: updateDialogView,
                title: '检查更新',
                titleColor: '#000000',
                positive: '下载',
                positiveColor: '#000000',
                negative: '取消',
                negativeColor: '#000000',
            }).on("positive", function(){
                threads.start(function(){
                    var apkResponse = http.get(newVUrl);
                    var apkBytes = apkResponse.body.bytes();
                    var apkPath = '/sdcard/cauto.apk';
                    files.writeBytes(apkPath, apkBytes);
                    if(files.exists(apkPath)){
                        toast('下载完成，开始安装');
                        app.viewFile(apkPath);
                    } else {
                        toast('下载失败');
                    }
                });
            }).on("negative", function(){
                updateDialog.dismiss();
            });
            let updateDialogWindow = updateDialog.getWindow();
            setBackgroundRounded(updateDialogWindow);
            updateDialog.show();
        } else {
            toast('您的Cauto已经是最新版本！')
        }
    });
};
ui.sidemenu.on('item_click', item => {
    switch(item.sidemenuTitle){
        case '太空漫游须知':
            ui.setContentView(layout_instructions);
            break;
        case '检查飞船更新':
            threads.start(function(){
                updateVersion();
            });
            break;
        case '结束航行':
            ui.finish();
            break;
    }
});
ui.autoService.on('check', function(checked){/* 无障碍服务权限设置 */
    if(checked && auto.service == null){
        app.startActivity({
            action: 'android.settings.ACCESSIBILITY_SETTINGS'
        });
    };
    if(!checked && auto.service != null){
        auto.service.disableSelf()
        ui.autoService,setChecked(false)
    }
});
ui.floatingWindow.on('check', function(checked) {/* 悬浮窗权限设置 */
    var intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:" + context.getPackageName()));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    app.startActivity(intent);
});
ui.emitter.on('resume', function(){/* 退出恢复权限默认 */
    ui.autoService.checked = auto.service != null;
    ui.floatingWindow.checked = floaty.checkPermission() != false;
});
// 0#根页面-4-程序标签页-0-导航标签
ui.programmesView.setTitles(["仓库", "运行", "日志"]);
ui.programmesTabs.setupWithViewPager(ui.programmesView);
// 0#根页面-4-程序标签页-1-仓库子标签页
var storage = storages.create('cardList');
var cardList = storage.get("items", []);
ui.cardList.setDataSource(cardList);
ui.cardList.on("item_long_click", function (e, item, i) {/* 长按删除 */
    let deleteDialogView = ui.inflate(
        <list id='content'>
            <text text='{{this}}' textColor='#555555'/>
        </list>
    );
    deleteDialogView.content.setDataSource(['删除后您还可以通过增加卡片和重新下载的方式重新使用您的脚本。']);
    let deleteDialog = dialogs.build({
        customView: deleteDialogView,
        title: '确定要删除' + item.cardTitle + '吗？',
        titleColor: '#000000',
        positive: '确定删除',
        positiveColor: '#000000',
        negative: '取消',
        negativeColor: '#000000',
    }).on("positive", function(){
        cardList.splice(i, 1);
    }).on("negative", function(){
        deleteDialog.dismiss();
    });
    let deleteDialogWindow = deleteDialog.getWindow();
    setBackgroundRounded(deleteDialogWindow);
    deleteDialog.show();
});
ui.emitter.on("pause", () => {
    storage.put("items", cardList);
});
ui.add.on('click', () => {/* 增加卡片 */
    let addDialogView = ui.inflate(
        <vertical padding='10'>
            <horizontal h='60' bg='file://./res/bar/buildTitle.png'>
                <input id='addTitle' w='150' h='40' margin='90 10 0 0' bg='#000000' size='14' color='#ffffff' hint='自定义脚本标题' textColorHint='#aaaaaa'/>
            </horizontal>
            <horizontal h='60' bg='file://./res/bar/buildSummary.png'>
                <input id='addSummary' w='150' h='40' margin='90 10 90 0' bg='#000000' size='14' color='#ffffff' hint='自定义脚本说明' textColorHint='#aaaaaa' password='true'/>
            </horizontal>
            <horizontal h='60' bg='file://./res/bar/buildCode.png'>
                <input id='addCode' w='150' h='40' margin='90 10 90 0' bg='#000000' size='14' color='#ffffff' hint='输入正确脚本编号' textColorHint='#aaaaaa' password='true'/>
            </horizontal>
        </vertical>
    );
    let addDialog = dialogs.build({
        customView: addDialogView,
        title: '新建脚本卡片',
        titleColor: '#000000',
        positive: '确定创建',
        positiveColor: '#000000',
        negative: '取消',
        negativeColor: '#000000',
    }).on("positive", function(){
        addScriptCard();
    }).on("negative", function(){
        addDialog.dismiss();
    });
    let addDialogWindow = addDialog.getWindow();
    setBackgroundRounded(addDialogWindow);
    addDialog.show();
    function addScriptCard(){
        cardTitle = addDialogView.addTitle.text();
        cardSummary = addDialogView.addSummary.text();
        cardCode = addDialogView.addCode.text();
        cardList.push({
            cardTitle: cardTitle,
            cardSummary: cardSummary,
            cardCode: cardCode,
        });
    };
});
ui.cardList.on('item_bind', function(itemView, itemHolder){/* 运行脚本 */
    itemView.run.on('click', function(){
        if (floaty.checkPermission() == false){
            toast("请先开启“悬浮窗”权限！");
            return;
        };
        if(auto.service == null){
            toast('请先开启“无障碍服务”权限！');
            return;
        };
        let item = itemHolder.item;
        var scriptPath = '/sdcard/' + item.cardCode + '.js'
        threads.start(function(){
            engines.execScriptFile(scriptPath);
        });
    });
});
ui.stop.on('click', () => {/* 停止脚本 */
    engines.all().map((ScriptEngine) => {
        if (engines.myEngine().toString() !== ScriptEngine.toString()) {
        ScriptEngine.forceStop();
        }
    });  
});
// 0#根页面-5-商店标签页定制渠道
ui.customization.on('click', () => {
    let customizationDialogView = ui.inflate(<list id='content'>
            <text text='{{this}}' textColor='#555555'/>
        </list>
    );
    customizationDialogView.content.setDataSource(['请联系创作者（微信号：cautowork）进行定制。须知：请将需求描述清晰，并以文档形式上传。'])
    let customizationDialog = dialogs.build({
        customView: customizationDialogView,
        title: '定制',
        titleColor: '#000000',
        positive: '确定',
        positiveColor: '#000000',
        negative: '取消',
        negativeColor: '#000000',
    }).on("positive", function(){
        customizationDialog.dismiss();
    }).on("negative", function(){
        customizationDialog.dismiss();
    });
    let customizationDialogWindow = customizationDialog.getWindow();
    setBackgroundRounded(customizationDialogWindow);
    customizationDialog.show();
});
// 0#根页面-6-个人标签页登录
ui.login.on('click', function(){
    let loginDialogView = ui.inflate(
        <vertical padding='10'>
            <horizontal h='60' bg='file://./res/bar/account.png'>
                <input id='account' w='150' h='40' margin='90 10 0 0' bg='#000000' size='16' color='#ffffff' hint='请输入账号' textColorHint='#aaaaaa'/>
            </horizontal>
            <horizontal h='60' bg='file://./res/bar/password.png'>
                <input id='password' w='150' h='40' margin='90 10 90 0' bg='#000000' size='16' color='#ffffff' hint='请输入密码' textColorHint='#aaaaaa' password='true'/>
            </horizontal>
        </vertical>
    );
    let loginDialog = dialogs.build({
    customView: loginDialogView,
    title: '登入Cauto',
    titleColor: '#000000',
    positive: '登录',
    positiveColor: '#000000',
    negative: '取消',
    negativeColor: '#000000',
    neutral: '注册账号',
    neutralColor: '#000000',
    }).on("positive", function(){
        toast('尚未开发登录功能');
    }).on("negative", function(){
        loginDialog.dismiss();
    }).on("neutral", function(){
        toast('尚未开发注册功能');
    });
    let loginDialogWindow = loginDialog.getWindow();
    setBackgroundRounded(loginDialogWindow);
    loginDialog.show();
});


// 1#使用须知页面-0-界面
let layout_instructions = ui.inflate(
    <frame bg='#000000'>
        <ScrollView>
            <vertical>
                <img h='400' src='file://./res/page/welcome.jpeg'/>
                <card gravity='center_vertical' w='*' margin='20 100' cardCornerRadius='30dp' cardElevation='1dp'>
                    <vertical gravity='center' padding='20 20 20 100' bg='#333333'>
                        <img h='70' src='file://./res/page/instructionsTitle.jpeg'/>
                        <text gravity='left' color='#bbbbbb'>本软件仅用于学习交流，内含可购买的服务应同样仅用于学习研究使用。</text>
                        <text marginTop='10' gravity='left' color='#bbbbbb'>此版本APP为测试版，功能仍在不断开发完善中，例如分享、收藏、登录等功能尚未开发完毕，但不影响使用。如果遇到问题请联系cautowork@163.com提交问题。</text>
                        <vertical margin='5 20 5 20' gravity='left'>
                            {/* 权限说明 */}
                            <card margin='5 20 0 10' w='100' cardCornerRadius='30dp' cardElevation='1dp'>
                                <vertical gravity='center_vertical' bg='#4b6b40'>
                                    <text gravity='center' margin='0 5 0 5' size='18' color='#ffffff'>权限说明</text>
                                </vertical>
                            </card>
                            <vertical margin='5 5'>
                                <text size='16' color='#ffffff' marginTop='5'>1.无障碍权限：</text>
                                <text color='#bbbbbb' marginTop='5'>脚本正常运行通常需要开启无障碍服务权限，用于脚本被允许在设备全局使用。</text>
                                <text size='16' color='#ffffff' marginTop='5'>2.悬浮窗权限：</text>
                                <text color='#bbbbbb' marginTop='5'>部分脚本需要悬浮窗权限，通常脚本执行事项需要在悬浮窗上显示，以帮助您获知脚本运行的情况。</text>
                            </vertical>
                            {/* 二、界面说明 */}
                            <card margin='5 20 0 10' w='100' cardCornerRadius='30dp' cardElevation='1dp'>
                                <vertical gravity='center_vertical' bg='#4b6b40'>
                                    <text gravity='center' margin='0 5 0 5' size='18' color='#ffffff'>界面说明</text>
                                </vertical>
                            </card>
                            <vertical margin='5 5'>
                                <text size='16' color='#ffffff' marginTop='5'>1.主页：</text>
                                <text color='#bbbbbb' marginTop='5'>主页分为三个标签页，分别是“程序”、“商店”、“个人”，同时左侧可以拉出侧拉菜单。</text>
                                <text size='16' color='#ffffff' marginTop='5'>2.“程序”标签页：</text>
                                <text color='#bbbbbb' marginTop='5'>程序页面主要用于承载您的脚本程序。</text>
                                <text size='16' color='#ffffff' marginTop='5'>3.“商店”标签页：</text>
                                <text color='#bbbbbb' marginTop='5'>商店页面主要用于下载您需要学习研究的脚本，由于脚本创作者独立创作不易，您通常需要付费购买脚本的使用权。</text>
                                <text size='16' color='#ffffff' marginTop='5'>4.“个人”标签页：</text>
                                <text color='#bbbbbb' marginTop='5'>个人页面主要记录您的个人信息。</text>
                                <text size='16' color='#ffffff' marginTop='5'>5.侧拉菜单：</text>
                                <text color='#bbbbbb' marginTop='5'>侧拉菜单主要用于权限看板和一些功能的承载。</text>
                            </vertical>
                            {/* 三、脚本使用 */}
                            <card margin='5 20 0 10' w='100' cardCornerRadius='30dp' cardElevation='1dp'>
                                <vertical gravity='center_vertical' bg='#4b6b40'>
                                    <text gravity='center' margin='0 5 0 5' size='18' color='#ffffff'>脚本使用</text>
                                </vertical>
                            </card>
                            <vertical margin='5 5'>
                                <text size='16' color='#ffffff' marginTop='5'>1.建立脚本：</text>
                                <text color='#bbbbbb' marginTop='5'>对于希望使用的脚本，您可以商店找到，同时您需要微信联系创作者，由创作者发放相应的激活码，激活后即可使用。</text>
                                <text size='16' color='#ffffff' marginTop='5'>2.运行脚本：</text>
                                <text color='#bbbbbb' marginTop='5'>点击脚本卡片的运行按钮即可进入脚本程序的运行过程。</text>
                                <text size='16' color='#ffffff' marginTop='5'>3.删除脚本：</text>
                                <text color='#bbbbbb' marginTop='5'>长按脚本卡片即可删除所选脚本。</text>
                            </vertical>
                        </vertical>
                    </vertical>
                </card>
            </vertical>
        </ScrollView>
        <relative>
            <card gravity='center' w='40' h='40' margin='20 50 0 0' cardCornerRadius='40dp' cardElevation='1dp'>
                <img id='back' w='30' h='30' src='@drawable/ic_arrow_back_black_48dp'/>
            </card>
            <img layout_gravity='bottom' src='file://./res/page/instructionsBottom.png' marginTop='590'/>
        </relative>
    </frame>, ViewGroup
);
// 1#使用须知页面-1-退出页面
layout_instructions.back.on("click", () => {
    ui.setContentView(ViewGroup)
});

// 2#1-商店“课程”分类子页面打开
ui.category_lesson.on('click', function(){
    engines.execScriptFile('./cat_lesson.js');
});
// 2#2-商店“打卡”分类子页面打开
ui.category_task.on('click', function(){
    engines.execScriptFile('./cat_task.js');
});
// 2#3-商店“抢票”分类子页面打开
ui.category_ticket.on('click', function(){
    engines.execScriptFile('./cat_ticket.js');
});
// 2#4-商店“养号”分类子页面打开
ui.category_video.on('click', function(){
    engines.execScriptFile('./cat_video.js');
});

