
import common from './css/common.css'
import sass from './css/back.scss'




function iframeInsert(url) {

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'loopsmozat://' + url);
    // console.log(url);
    iframe.style.height = 0;
    iframe.style.width = 0;
    iframe.style.position = 'absolute';
    iframe.style.zIndex = -1000;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // after 1000ms. remove the iframe to make it looks clean.
    setTimeout(function() {
        document.body.removeChild(iframe)
    }, 1000);
}

/**
 * 埋点的方法
 * @param id  [type: Number]  [埋点工程师规定的一个固定数字]
 * @param obj [type: Object] [传入后台需要的参数，比如{ host_id : 主播id }]
 */

function di(obj, id) {
    var params = obj || {};
    //14225 活动通用id
    params.id = id || 14225;
    params.ts = Date.now();
    var url = 'util/statistical?point=' + JSON.stringify(params);
    // console.log('埋点链接：'+ url);
    iframeInsert(url);
    // console.log('埋点完毕');
}

/**
 *  打开game中的某个界面
 * @param appid  [type: number] //游戏id
 * @param version [type: Number] //游戏版本
 */
function openGame(appid, version) {
    const url = `util/openGame?appid=${appid}&version=${version}`;
    iframeInsert(url);
}

function  openAppPage(pageName, unlockType) {
    const url = 'util/openAppPage?pageName=' + pageName + '&unlockType=' + unlockType;
    iframeInsert(url);
}

function getUrlParams(...args) {

    /*这个函数的作用是将uerid和token分离出来*/
    function getByName(name) {
        const reg = new RegExp(`(^|&|\\?)${name}=([^&|#]*)`, 'i');
        const param = window.location.href.substring(0).match(reg);
        if (param !== null) {
            return param[2];
        }
        return undefined;
    }

    if (arguments.length === 1) {
        return getByName(args[0]) || {};
    }
    const result = {};
    [...args].forEach((name) => {
        result[name] = getByName(name);
    });
    return result;
}

function getSource() {
    var clickSource = getUrlParams('source');
    var user_id=getUrlParams('userId');
    // console.log(clickSource);

    switch (clickSource){
        case 'live':
            di({
                page: " Top Up event",
                title: "Top Up event",
                source:'live'
            },14226);
            break;
        case 'banner':
            di({
                page: "Top Up event",
                title: "Top Up event",
                source:'banner'
            },14226);
            break;
        case 'notification':
            di({
                page: "Top Up event",
                title: "Top Up event",
                source:'notification'
            },14226);
            break;
        case 'popup':
            di({
                page: "Top Up event",
                title: "Top Up event",
                source:'popup'
            },14226);
            break;
        case 'sms':
            di({
                page: "Top Up event",
                title: "Top Up event",
                source:'sms',
                host_id:user_id
            },14226);
            break;
        default:
            di({
                page: "Top Up event",
                title: "Top Up event",
                source:'banner'
            },14226);
    }
}
/*点击topup按钮*/
var btn=document.querySelector('.btn');

var user_id=getUrlParams('userId');
btn.onclick=function () {
    openAppPage('topup', -1);

    di({
        page: "Top Up event",
        title: "Top Up event",
        button_name: "Top Up event-topUpBtn", //充值按钮
        host_id: user_id,
    })
}


/*点击弹窗中的按钮*/
var okBtn =document.querySelector('.ok-btn');
okBtn.onclick=function () {
    //跳转首页
    openAppPage('home');
    di({
        page: "Top Up event",
        title: "Top Up event",
        button_name: "Top-Up-event-goHomeBtn", //跳转首页按钮
        host_id: user_id,
    })


}


getSource();
