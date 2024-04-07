var n = 0;
var stop = false;
var w = floaty.rawWindow(
    <frame gravity='center' bg='#cccccc'>
        <vertical>
            <text id='windowText1' padding='5 0 5 0' color='#ffffff'></text>
            <text id='windowText2' padding='5 0 5 0' color='#ffffff'></text>
            <button id='stop' text='停止'/>
        </vertical>
    </frame>
);
w.stop.click(() => {
    stop = true;
    alert('脚本已停止');
});        
w.setPosition(300, 0);
// w.setTouchable(false);
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
boundsClick(text('二级C语言编程技巧与实例解析（山东联盟）'));
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
// 弹题
while(!stop){
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
    sleep(2000); 
};
w.close();


function boundsClick(widget){
    var coord = widget.findOnce().bounds();
    click(coord.centerX(), coord.centerY());
};
  