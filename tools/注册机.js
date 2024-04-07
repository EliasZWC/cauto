// 界面设计
'ui';

ui.layout(
    <vertical padding='10'>

        <horizontal margin='10 10 0 0'>
            <text>选择购买时长</text>
            <spinner id ='purchase' entries='一天|一个月|三个月|半年|一年'/>
            <button id = 'confirm' text='确定购买时长'/>
        </horizontal>
        
        <horizontal marginTop='50'>
            <text text='机器码：'/>
            <input id='machineCode' w='*'/>
        </horizontal>

        <button id='generate' text='生成激活码'/>

        <text color='red'>激活码：</text>
        <text id='activationCode'>未生成</text>
        
        <text color='green'>使用到期时间：</text>
        <text id='deadline'>未生成</text>

    </vertical>
);

// 定义格式化时间函数
function dateFormat(thisDate, fmt){
    var o = {
        'M+': thisDate.getMonth() + 1,
        'd+': thisDate.getDate(),
        'h+': thisDate.getHours(),
        'm+': thisDate.getMinutes(),
        's+': thisDate.getSeconds(),
        'q+': Math.floor((thisDate.getMonth() + 3) / 3),
        's': thisDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for  (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00'+ o[k]).substr(("" + o[k]).length)));
    return fmt
};
// 定义MD5加密算法函数
function md5(string){
    var res = java.math.BigInteger(1, java.security.MessageDigest.getInstance('MD5').digest(java.lang.String(string).getBytes())).toString(16);
    while(res.length < 32)res = '0' + res;
    return res
};
// 定义截止日期函数
function deadline(timeType, number){
    var d = new Date()
    var timeStamp = parseInt(d.valueOf())
    var year = (1000 * 60 * 60 * 24 * 30 * 12)
    var month = (1000 * 60 * 60 * 24 * 30)
    var day = (1000 * 60 * 60 * 24)
    var type = {y:year, m:month, d:day}[timeType]
    var period = number * type
    var date = timeStamp + period
    return date
};

// 确定购买时长
ui.confirm.on('click', function(){
    var index = ui.purchase.
    getSelectedItemPosition();
    switch(index){
        case 0:
            toast('您设置的使用时长为一天！');
            break;
        case 1:
            toast('您设置的使用时长为一个月！');
            break;
        case 2:
            toast('您设置的使用时长为三个月！');
            break;
        case 3:
            toast('您设置的使用时长为半年！');
            break;
        case 4:
            toast('您设置的使用时长为一年！');
            break;
    }
})
// 激活码生成
ui.generate.on('click', function(){
    // 获得机器码文本
    var machineCode = ui.machineCode.text()
    // 激活码算法
    var activationCode = md5(machineCode)
    // 显示激活码
    var code = activationCode.toString()
    ui.activationCode.setText(code)
    // 自动复制激活码
    setClip(code)
    toast('激活码已复制')
})