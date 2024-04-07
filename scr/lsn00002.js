while(true){
    var i = dialogs.select('您确定运行程序吗？', '确定运行', '取消运行');
    if(i == -1){
        toast('请选择是否运行！');
        continue;
    };
    if(i == 1){
        toast("已取消");
        break;
    }else{
        var w = floaty.rawWindow(
            <frame gravity='center' bg='#cccccc'>
                <vertical>
                    <text id='windowText1' padding='5 0 5 0' color='#ffffff'></text>
                    <text id='windowText2' padding='5 0 5 0' color='#ffffff'></text>
                </vertical>
            </frame>
        );
        w.setPosition(150, 0);
        w.setTouchable(false);
        ui.run(function(){
            w.windowText1.setText('开始运行程序')
        });
        app.startActivity({
            action: 'android.intent.action.VIEW',
            packageName: 'com.able.wisdomtree',
            className: 'com.able.wisdomtree.login.MainGroupActivity'
        })
        ui.run(function(){
            w.windowText2.setText('正在进入知到“学习”页面')
        });
        className('android.view.ViewGroup').desc('1').findOne().click();
        sleep(3000);
        ui.run(function(){
            w.windowText1.setText('进入课程播放页面')
        });
        boundsClick(text('环境学概论（山东联盟）'));
        sleep(1000);
        ui.run(function(){
            w.windowText2.setText('正在点击继续学习')
        });
        id('continue_study_btn').findOne().click();
        sleep(1000);
        ui.run(function(){
            w.windowText1.setText('正在查看是否需要流量播放')
        });
        if(id('play').exists()){
            ui.run(function(){
                w.windowText1.setText('需要流量播放')
            });
            boundsClick(id('play'));
        };
        ui.run(function(){
            w.windowText2.setText('正在放大视频')
        });
        id('ijk_layout_controller_cover_screen_btn').findOne().click();
        sleep(1000)
        ui.run(function(){
            w.windowText1.setText('正在调节倍速')
        });
        text('1.0x').findOnce().click();
	    sleep(500);
	    text('1.25x').findOnce().click();
        ui.run(function(){
            w.windowText2.setText('视频播放中')
        });
        n = 0;
        t = 1;
        // 弹题
        while(true){
            if(text('A').findOnce()){
                sleep(500)
                text('A').findOnce().click()
                sleep(1000)
                text('关闭').findOnce().click()
                n += 1;
                ui.run(function(){
                    w.windowText1.setText('已关闭' + n + '个弹题')
                });
            };
        };
    };
};

function boundsClick(widget){
    var coord = widget.findOnce().bounds();
    click(coord.centerX(), coord.centerY());
};
  